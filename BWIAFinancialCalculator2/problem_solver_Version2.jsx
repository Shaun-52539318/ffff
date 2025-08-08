import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, PuzzleIcon, TrendingUp, AlertCircle } from "lucide-react";
import { solveProblem64, Problem64Result } from "@/lib/financial-math";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function ProblemSolver() {
  const [nominalRate, setNominalRate] = useState<string>("12.00");
  const [initialInvestment, setInitialInvestment] = useState<string>("10000");
  const [inflationRate, setInflationRate] = useState<string>("8.00");
  const [firstWithdrawalValue, setFirstWithdrawalValue] = useState<string>("5000");
  const [investmentYears, setInvestmentYears] = useState<string>("40");
  const [withdrawalYears, setWithdrawalYears] = useState<string>("20");
  const [result, setResult] = useState<Problem64Result | null>(null);

  const handleSolve = () => {
    const nominal = parseFloat(nominalRate);
    const initial = parseFloat(initialInvestment);
    const inflation = parseFloat(inflationRate);
    const withdrawal = parseFloat(firstWithdrawalValue);
    const investYears = parseFloat(investmentYears);
    const withdrawYears = parseFloat(withdrawalYears);

    if ([nominal, initial, inflation, withdrawal, investYears, withdrawYears].some(isNaN)) {
      return;
    }

    const solution = solveProblem64(nominal, initial, inflation, withdrawal, investYears, withdrawYears);
    setResult(solution);
  };

  // Generate sensitivity analysis data
  const generateInterestSensitivity = () => {
    const rates = [8, 10, 12, 14, 16];
    return rates.map(rate => {
      const solution = solveProblem64(rate, parseFloat(initialInvestment), parseFloat(inflationRate), parseFloat(firstWithdrawalValue));
      return {
        rate: `${rate}%`,
        payment: Math.round(solution.firstPayment)
      };
    });
  };

  const generateInflationSensitivity = () => {
    const rates = [4, 6, 8, 10, 12];
    return rates.map(inflation => {
      const solution = solveProblem64(parseFloat(nominalRate), parseFloat(initialInvestment), inflation, parseFloat(firstWithdrawalValue));
      return {
        rate: `${inflation}%`,
        payment: Math.round(solution.firstPayment)
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Problem Description */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Problem 6.4: Student Investment Scenario</strong><br />
          Calculate the first payment for a student investing R10,000 initially, making monthly payments that increase with inflation, 
          investing for 40 years, then withdrawing for 20 years with inflation-adjusted withdrawals.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <Card className="financial-card">
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nominalRate">Nominal Interest Rate (%)</Label>
              <Input
                id="nominalRate"
                type="number"
                step="0.01"
                value={nominalRate}
                onChange={(e) => setNominalRate(e.target.value)}
                className="financial-input"
              />
              <p className="text-xs text-gray-500 mt-1">Compounded monthly</p>
            </div>

            <div>
              <Label htmlFor="initialInvestment">Initial Investment (R)</Label>
              <Input
                id="initialInvestment"
                type="number"
                step="0.01"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                className="financial-input"
              />
            </div>

            <div>
              <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
              <Input
                id="inflationRate"
                type="number"
                step="0.01"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                className="financial-input"
              />
              <p className="text-xs text-gray-500 mt-1">Annual inflation assumption</p>
            </div>

            <div>
              <Label htmlFor="firstWithdrawalValue">First Withdrawal Value (R)</Label>
              <Input
                id="firstWithdrawalValue"
                type="number"
                step="0.01"
                value={firstWithdrawalValue}
                onChange={(e) => setFirstWithdrawalValue(e.target.value)}
                className="financial-input"
              />
              <p className="text-xs text-gray-500 mt-1">Value in 2000 terms</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="investmentYears">Investment Years</Label>
                <Input
                  id="investmentYears"
                  type="number"
                  value={investmentYears}
                  onChange={(e) => setInvestmentYears(e.target.value)}
                  className="financial-input"
                />
              </div>
              <div>
                <Label htmlFor="withdrawalYears">Withdrawal Years</Label>
                <Input
                  id="withdrawalYears"
                  type="number"
                  value={withdrawalYears}
                  onChange={(e) => setWithdrawalYears(e.target.value)}
                  className="financial-input"
                />
              </div>
            </div>

            <Button onClick={handleSolve} className="w-full financial-button">
              <Calculator className="mr-2" size={16} />
              Solve Problem 6.4
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="financial-card">
          <CardHeader>
            <CardTitle>Solution Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result ? (
              <>
                <div className="financial-result">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">First Monthly Payment:</span>
                    <span className="text-xl font-bold text-green-600 font-mono">
                      R {result.firstPayment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Effective Annual Rate:</span>
                    <span className="font-mono">{result.effectiveAnnualRate.toFixed(4)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Monthly Effective Rate:</span>
                    <span className="font-mono">{result.monthlyEffectiveRate.toFixed(4)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Investment Period:</span>
                    <span className="font-mono">{investmentYears} years (480 months)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Withdrawal Period:</span>
                    <span className="font-mono">{withdrawalYears} years (240 months)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Key Calculations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Future Value of Initial Investment:</span>
                      <span className="font-mono">R {result.futureValueInitial.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target Fund at Retirement:</span>
                      <span className="font-mono">R {result.targetFund.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">First Withdrawal (2040):</span>
                      <span className="font-mono">R {result.firstWithdrawal.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <PuzzleIcon className="mx-auto mb-2" size={48} />
                <p>Click "Solve Problem 6.4" to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sensitivity Analysis */}
      <Card className="financial-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="text-blue-600 mr-2" size={20} />
            Parameter Sensitivity Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Interest Rate Impact</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={generateInterestSensitivity()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rate" />
                  <YAxis tickFormatter={(value) => `R${value}`} />
                  <Tooltip formatter={(value) => [`R${Number(value).toLocaleString()}`, "First Payment"]} />
                  <Line 
                    type="monotone" 
                    dataKey="payment" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ fill: '#2563eb', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Inflation Rate Impact</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={generateInflationSensitivity()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rate" />
                  <YAxis tickFormatter={(value) => `R${value}`} />
                  <Tooltip formatter={(value) => [`R${Number(value).toLocaleString()}`, "First Payment"]} />
                  <Bar dataKey="payment" fill="#16a34a" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Key Insights</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Interest rate has the highest impact on required monthly payment</li>
              <li>• 1% increase in interest rate reduces payment by approximately R150-200</li>
              <li>• Inflation rate significantly affects withdrawal calculations</li>
              <li>• Investment period length has exponential impact due to compounding</li>
              <li>• The target fund must grow to match inflation-adjusted withdrawal needs</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );

}