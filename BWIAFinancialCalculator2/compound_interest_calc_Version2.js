import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp } from "lucide-react";
import { calculateCompoundInterest, CompoundInterestResult } from "@/lib/financial-math";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type CalculationType = "future-value" | "present-value" | "interest-rate" | "time-period";

const calculationLabels: Record<CalculationType, string> = {
  "future-value": "Future Value",
  "present-value": "Present Value", 
  "interest-rate": "Interest Rate",
  "time-period": "Time Period"
};

const compoundingOptions = [
  { value: "1", label: "Annually" },
  { value: "2", label: "Semi-annually" },
  { value: "4", label: "Quarterly" },
  { value: "12", label: "Monthly" },
  { value: "52", label: "Weekly" },
  { value: "365", label: "Daily" }
];

export default function CompoundInterestCalculator() {
  const [calculationType, setCalculationType] = useState<CalculationType>("future-value");
  const [principal, setPrincipal] = useState<string>("10000");
  const [rate, setRate] = useState<string>("8.5");
  const [time, setTime] = useState<string>("5");
  const [futureValue, setFutureValue] = useState<string>("");
  const [compounding, setCompounding] = useState<string>("12");
  const [result, setResult] = useState<CompoundInterestResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleCalculate = () => {
    setError("");
    
    try {
      const p = principal ? parseFloat(principal) : undefined;
      const r = rate ? parseFloat(rate) : undefined;
      const t = time ? parseFloat(time) : undefined;
      const fv = futureValue ? parseFloat(futureValue) : undefined;
      const freq = parseInt(compounding);

      const calculation = calculateCompoundInterest(p, r, t, freq, fv);
      setResult(calculation);
    } catch (err) {
      setError("Please provide sufficient parameters for calculation");
    }
  };

  // Generate chart data for compound growth
  const generateChartData = () => {
    if (!result) return [];
    
    const data = [];
    const years = Math.ceil(result.time);
    const yearlyRate = result.rate / 100;
    const freq = result.compoundingFreq;
    
    for (let year = 0; year <= years; year++) {
      const value = result.principal * Math.pow(1 + yearlyRate / freq, freq * year);
      data.push({
        year,
        value: Math.round(value)
      });
    }
    
    return data;
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
              <CardTitle>Compound Interest Calculator</CardTitle>
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
                  <Label htmlFor="compounding">Compounding Frequency</Label>
                  <Select value={compounding} onValueChange={setCompounding}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {compoundingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
                  <Label htmlFor="rate">Annual Interest Rate (%)</Label>
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
              </div>

              <div className="flex gap-4 mb-4">
                <Button onClick={handleCalculate} className="flex-1 financial-button">
                  <Calculator className="mr-2" size={16} />
                  Calculate Compound Interest
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
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Principal:</span>
                        <span className="font-mono">R {result.principal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual Rate:</span>
                        <span className="font-mono">{result.rate.toFixed(4)}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time Period:</span>
                        <span className="font-mono">{result.time.toFixed(2)} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Compounding:</span>
                        <span className="font-mono">{compoundingOptions.find(opt => opt.value === compounding)?.label}</span>
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
              <CardTitle>Quick Reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <strong>Compound Interest Formula:</strong><br />
                <code className="text-xs">FV = P(1 + r/n)^(nt)</code>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <strong>Where:</strong><br />
                P = Principal<br />
                r = Annual rate<br />
                n = Compounding frequency<br />
                t = Time period
              </div>
              <div className="bg-green-50 p-3 rounded">
                <strong>The Power of Compounding:</strong><br />
                Higher frequency = Higher returns<br />
                Time has exponential effect
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Growth Chart */}
      {result && (
        <Card className="financial-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="text-blue-600 mr-2" size={20} />
              Compound Growth Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={generateChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `R${(value/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => [`R${Number(value).toLocaleString()}`, "Value"]} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
