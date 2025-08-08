import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { calculateSimpleInterest, SimpleInterestResult } from "@/lib/financial-math";

type CalculationType = "future-value" | "present-value" | "interest-rate" | "time-period" | "interest-earned";

const calculationLabels: Record<CalculationType, string> = {
  "future-value": "Future Value",
  "present-value": "Present Value", 
  "interest-rate": "Interest Rate",
  "time-period": "Time Period",
  "interest-earned": "Interest Earned"
};

export default function SimpleInterestCalculator() {
  const [calculationType, setCalculationType] = useState<CalculationType>("future-value");
  const [principal, setPrincipal] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [futureValue, setFutureValue] = useState<string>("");
  const [result, setResult] = useState<SimpleInterestResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleCalculate = () => {
    setError("");
    
    try {
      const p = principal ? parseFloat(principal) : undefined;
      const r = rate ? parseFloat(rate) : undefined;
      const t = time ? parseFloat(time) : undefined;
      const fv = futureValue ? parseFloat(futureValue) : undefined;

      const calculation = calculateSimpleInterest(p, r, t, fv);
      setResult(calculation);
    } catch (err) {
      setError("Please provide sufficient parameters for calculation");
    }
  };

  const clearForm = () => {
    setPrincipal("");
    setRate("");
    setTime("");
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
              <CardTitle>Simple Interest Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                  <Label htmlFor="principal">Principal Amount (R)</Label>
                  <Input
                    id="principal"
                    type="number"
                    step="0.01"
                    placeholder="10000"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                    className="financial-input"
                    disabled={calculationType === "present-value"}
                  />
                </div>

                <div>
                  <Label htmlFor="rate">Interest Rate (%)</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    placeholder="8.5"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="financial-input"
                    disabled={calculationType === "interest-rate"}
                  />
                </div>

                <div>
                  <Label htmlFor="time">Time Period (years)</Label>
                  <Input
                    id="time"
                    type="number"
                    step="0.1"
                    placeholder="5"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="financial-input"
                    disabled={calculationType === "time-period"}
                  />
                </div>

                {(calculationType === "present-value" || calculationType === "interest-rate" || calculationType === "time-period") && (
                  <div className="md:col-span-2">
                    <Label htmlFor="futureValue">Future Value (R)</Label>
                    <Input
                      id="futureValue"
                      type="number"
                      step="0.01"
                      placeholder="14250"
                      value={futureValue}
                      onChange={(e) => setFutureValue(e.target.value)}
                      className="financial-input"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 mb-4">
                <Button onClick={handleCalculate} className="flex-1 financial-button">
                  <Calculator className="mr-2" size={16} />
                  Calculate Simple Interest
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600">Future Value</div>
                    <div className="text-2xl font-bold text-blue-600 font-mono">
                      R {result.futureValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="financial-result text-center">
                    <div className="text-sm text-gray-600">Interest Earned</div>
                    <div className="text-2xl font-bold text-green-600 font-mono">
                      R {result.interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Calculation Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Principal:</span>
                      <span className="font-mono">R {result.principal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span className="font-mono">{result.rate.toFixed(4)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Period:</span>
                      <span className="font-mono">{result.time.toFixed(2)} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Interest:</span>
                      <span className="font-mono">R {result.interest.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
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
              <CardTitle>Quick Reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <strong>Simple Interest Formula:</strong><br />
                <code className="text-xs">I = P × r × t</code>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <strong>Future Value:</strong><br />
                <code className="text-xs">FV = P(1 + rt)</code>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <strong>Where:</strong><br />
                P = Principal<br />
                r = Interest rate (decimal)<br />
                t = Time period
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <strong>Example:</strong><br />
                P = R10,000<br />
                r = 8.5% (0.085)<br />
                t = 5 years<br />
                I = R4,250<br />
                FV = R14,250
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}