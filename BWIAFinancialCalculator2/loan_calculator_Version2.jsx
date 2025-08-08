import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Home, Download } from "lucide-react";
import { calculateLoan, LoanResult } from "@/lib/financial-math";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface AmortizationEntry {
  payment: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
}

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>("250000");
  const [interestRate, setInterestRate] = useState<string>("8.5");
  const [termYears, setTermYears] = useState<string>("20");
  const [result, setResult] = useState<LoanResult | null>(null);
  const [amortizationTable, setAmortizationTable] = useState<AmortizationEntry[]>([]);
  const [showFullTable, setShowFullTable] = useState<boolean>(false);

  const handleCalculate = () => {
    const amount = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const term = parseFloat(termYears);

    if (isNaN(amount) || isNaN(rate) || isNaN(term)) return;

    const loanResult = calculateLoan(amount, rate, term);
    setResult(loanResult);

    // Generate amortization table
    generateAmortizationTable(amount, rate, term, loanResult.monthlyPayment);
  };

  const generateAmortizationTable = (principal: number, annualRate: number, years: number, monthlyPayment: number) => {
    const monthlyRate = annualRate / 100 / 12;
    const totalPayments = years * 12;
    const table: AmortizationEntry[] = [];
    let remainingBalance = principal;

    for (let month = 1; month <= totalPayments; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance = Math.max(0, remainingBalance - principalPayment);

      table.push({
        payment: month,
        principalPayment,
        interestPayment,
        remainingBalance
      });
    }

    setAmortizationTable(table);
  };

  const getDisplayedTable = () => {
    if (showFullTable) return amortizationTable;
    return amortizationTable.slice(0, 12); // Show first year only
  };

  const getPieChartData = () => {
    if (!result) return [];
    
    return [
      {
        name: "Principal",
        value: result.loanAmount,
        color: "#2563eb"
      },
      {
        name: "Interest",
        value: result.totalInterest,
        color: "#dc2626"
      }
    ];
  };

  const clearForm = () => {
    setLoanAmount("");
    setInterestRate("");
    setTermYears("");
    setResult(null);
    setAmortizationTable([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="financial-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="text-blue-600 mr-2" size={20} />
                Loan Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="loanAmount">Loan Amount (R)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    step="1000"
                    placeholder="250000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="financial-input"
                  />
                </div>

                <div>
                  <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    placeholder="8.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="financial-input"
                  />
                </div>

                <div>
                  <Label htmlFor="termYears">Loan Term (years)</Label>
                  <Input
                    id="termYears"
                    type="number"
                    step="1"
                    placeholder="20"
                    value={termYears}
                    onChange={(e) => setTermYears(e.target.value)}
                    className="financial-input"
                  />
                </div>
              </div>

              <div className="flex gap-4 mb-6">
                <Button onClick={handleCalculate} className="flex-1 financial-button">
                  <Calculator className="mr-2" size={16} />
                  Calculate Loan
                </Button>
                <Button onClick={clearForm} variant="outline">
                  Clear
                </Button>
              </div>

              {result && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600">Monthly Payment</div>
                    <div className="text-xl font-bold text-blue-600 font-mono">
                      R {result.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="financial-result text-center">
                    <div className="text-sm text-gray-600">Total Interest</div>
                    <div className="text-xl font-bold text-green-600 font-mono">
                      R {result.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600">Total Payments</div>
                    <div className="text-xl font-bold text-gray-700 font-mono">
                      R {result.totalPayments.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600">Term (months)</div>
                    <div className="text-xl font-bold text-orange-600 font-mono">
                      {result.termMonths}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Loan Breakdown Chart */}
        {result && (
          <Card className="financial-card">
            <CardHeader>
              <CardTitle>Loan Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={getPieChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getPieChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R${Number(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Rate:</span>
                  <span className="font-mono">{result.interestRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Percentage:</span>
                  <span className="font-mono">{((result.totalInterest / result.totalPayments) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Amortization Table */}
      {amortizationTable.length > 0 && (
        <Card className="financial-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Calculator className="text-blue-600 mr-2" size={20} />
                Amortization Schedule {!showFullTable && "(First 12 months)"}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowFullTable(!showFullTable)}
                  variant="outline"
                  size="sm"
                >
                  {showFullTable ? "Show First Year" : "Show Full Schedule"}
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2" size={16} />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment #</TableHead>
                    <TableHead>Principal Payment</TableHead>
                    <TableHead>Interest Payment</TableHead>
                    <TableHead>Remaining Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getDisplayedTable().map((entry) => (
                    <TableRow key={entry.payment}>
                      <TableCell className="font-mono">{entry.payment}</TableCell>
                      <TableCell className="font-mono text-blue-600">
                        R {entry.principalPayment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="font-mono text-red-600">
                        R {entry.interestPayment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="font-mono">
                        R {entry.remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {!showFullTable && amortizationTable.length > 12 && (
              <div className="mt-4 text-center text-sm text-gray-600">
                Showing first 12 of {amortizationTable.length} payments
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
