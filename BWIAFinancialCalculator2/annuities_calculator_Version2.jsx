import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calculator, Coins } from "lucide-react";
import { calculateOrdinaryAnnuity, AnnuityResult } from "@/lib/financial-math";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type AnnuityType = "ordinary" | "due" | "increasing-k" | "increasing-every";
type CalculationType = "payment" | "present-value" | "future-value";

const annuityTypeLabels: Record<AnnuityType, string> = {
  "ordinary": "Ordinary Annuity",
  "due": "Annuity Due",
  "increasing-k": "Increasing Annuity (every k periods)",
  "increasing-every": "Increasing Annuity (every period)"
};

const calculationLabels: Record<CalculationType, string> = {
  "payment": "Payment Amount",
  "present-value": "Present Value",
  "future-value": "Future Value"
};

export default function AnnuitiesCalculator() {
  const [annuityType, setAnnuityType] = useState<AnnuityType>("ordinary");
  const [calculationType, setCalculationType] = useState<CalculationType>("payment");
  const [payment, setPayment] = useState<string>("");
  const [presentValue, setPresentValue] = useState<string>("");
  const [futureValue, setFutureValue] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("8");
  const [periods, setPeriods] = useState<string>("10");
  const [growthRate, setGrowthRate] = useState<string>("3");
  const [kPeriods, setKPeriods] = useState<string>("12");
  const [result, setResult] = useState<AnnuityResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleCalculate = () => {
    setError("");
    
    try {
      const pmt = payment ? parseFloat(payment) : undefined;
      const pv = presentValue ? parseFloat(presentValue) : undefined;
      const fv = futureValue ? parseFloat(futureValue) : undefined;
      const rate = parseFloat(interestRate);
      const n = parseFloat(periods);

      if (isNaN(rate) || isNaN(n)) {
        setError("Please enter valid interest rate and number of periods");
        return;
      }

      // For now, handle ordinary annuity calculations
      // In a full implementation, you would handle all annuity types
      const calculation = calculateOrdinaryAnnuity(pmt, rate, n, pv, fv);
      setResult(calculation);
    } catch (err) {
      setError("Please provide sufficient parameters for calculation");
    }
  };

  const getChartData = () => {
    if (!result) return [];
    
    return [
      {
        name: "Payment",
        value: result.payment
      },
      {
        name: "Present Value",
        value: result.presentValue
      },
      {
        name: "Future Value", 
        value: result.futureValue
      }
    ];
  };

  const clearForm = () => {
    setPayment("");
    setPresentValue("");
    setFutureValue("");
    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="financial-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Coins className="text-blue-600 mr-2" size={20} />
                Annuities Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="annuityType">Annuity Type</Label>
                  <Select value={annuityType} onValueChange={(value) => setAnnuityType(value as AnnuityType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(annuityTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="calculationType">Calculate</Label>
                  <Select value={calculationType} onValueChange={(value) => setCalculationType(value as CalculationType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(calculationLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="payment">Payment Amount (R)</Label>
                  <Input
                    id="payment"
                    type="number"
                    step="0.01"
                    placeholder="1000"
                    value={payment}
                    onChange={(e) => setPayment(e.target.value)}
                    className="financial-input"
                    disabled={calculationType === "payment"}
                  />
                </div>

                <div>
                  <Label htmlFor="interestRate">Interest Rate (% per period)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    placeholder="8"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="financial-input"
                  />
                </div>

                <div>
                  <Label htmlFor="periods">Number of Periods</Label>
                  <Input
                    id="periods"
                    type="number"
                    step="1"
                    placeholder="10"
                    value={periods}
                    onChange={(e) => setPeriods(e.target.value)}
                    className="financial-input"
                  />
                </div>

                {calculationType === "payment" && (
                  <div>
                    <Label htmlFor="presentValue">Present Value (R)</Label>
                    <Input
                      id="presentValue"
                      type="number"
                      step="0.01"
                      placeholder="10000"
                      value={presentValue}
                      onChange={(e) => setPresentValue(e.target.value)}
                      className="financial-input"
                    />
                  </div>
                )}

                {calculationType === "present-value" && (
                  <div>
                    <Label htmlFor="futureValue">Future Value (R)</Label>
                    <Input
                      id="futureValue"
                      type="number"
                      step="0.01"
                      placeholder="15000"
                      value={futureValue}
                      onChange={(e) => setFutureValue(e.target.value)}
                      className="financial-input"
                    />
                  </div>
                )}

                {(annuityType === "increasing-k" || annuityType === "increasing-every") && (
                  <>
                    <div>
                      <Label htmlFor="growthRate">Growth Rate (%)</Label>
                      <Input
                        id="growthRate"
                        type="number"
                        step="0.01"
                        placeholder="3"
                        value={growthRate}
                        onChange={(e) => setGrowthRate(e.target.value)}
                        className="financial-input"
                      />
                    </div>
                    
                    {annuityType === "increasing-k" && (
                      <div>
                        <Label htmlFor="kPeriods">Increase Every K Periods</Label>
                        <Input
                          id="kPeriods"
                          type="number"
                          step="1"
                          placeholder="12"
                          value={kPeriods}
                          onChange={(e) => setKPeriods(e.target.value)}
                          className="financial-input"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-4 mb-4">
                <Button onClick={handleCalculate} className="flex-1 financial-button">
                  <Calculator className="mr-2" size={16} />
                  Calculate Annuity
                </Button>
                <Button onClick={clearForm} variant="outline">
                  Clear
                </Button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {result && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600">Payment</div>
                    <div className="text-lg font-bold text-blue-600 font-mono">
                      R {result.payment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="financial-result text-center">
                    <div className="text-sm text-gray-600">Present Value</div>
                    <div className="text-lg font-bold text-green-600 font-mono">
                      R {result.presentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600">Future Value</div>
                    <div className="text-lg font-bold text-orange-600 font-mono">
                      R {result.futureValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Calculation Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Payments:</span>
                        <span className="font-mono">R {result.totalPayments.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Interest:</span>
                        <span className="font-mono">R {result.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest Rate:</span>
                        <span className="font-mono">{interestRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Number of Periods:</span>
                        <span className="font-mono">{periods}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="financial-card">
            <CardHeader>
              <CardTitle>Annuity Formulas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <strong>Ordinary Annuity PV:</strong><br />
                <code className="text-xs">PV = PMT × [(1-(1+r)^-n)/r]</code>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <strong>Ordinary Annuity FV:</strong><br />
                <code className="text-xs">FV = PMT × [((1+r)^n-1)/r]</code>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <strong>Annuity Due:</strong><br />
                Multiply by (1+r)
              </div>
              <div className="bg-green-50 p-3 rounded">
                <strong>Key Difference:</strong><br />
                Ordinary: End of period<br />
                Due: Beginning of period
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Visualization */}
      {result && (
        <Card className="financial-card">
          <CardHeader>
            <CardTitle>Annuity Values Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `R${(value/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => [`R${Number(value).toLocaleString()}`, "Amount"]} />
                <Bar dataKey="value" fill="#2563eb" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

