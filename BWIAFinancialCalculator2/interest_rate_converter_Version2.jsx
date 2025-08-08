import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, ArrowLeft, Calculator } from "lucide-react";
import { 
  convertFromSimple, 
  convertFromEffectiveAnnual, 
  convertFromNominal, 
  InterestRateConversion 
} from "@/lib/financial-math";
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type RateType = "simple" | "effective-annual" | "nominal" | "effective-periodic" | "force";

const rateTypeLabels: Record<RateType, string> = {
  "simple": "Simple Interest Rate",
  "effective-annual": "Effective Annual Interest Rate", 
  "nominal": "Nominal Interest Rate",
  "effective-periodic": "Effective Periodic Interest Rate",
  "force": "Force of Interest"
};

const compoundingOptions = [
  { value: "1", label: "Annually" },
  { value: "2", label: "Semi-annually" },
  { value: "4", label: "Quarterly" },
  { value: "12", label: "Monthly" },
  { value: "52", label: "Weekly" },
  { value: "365", label: "Daily" }
];

export default function InterestRateConverter() {
  const [fromRateType, setFromRateType] = useState<RateType>("simple");
  const [toRateType, setToRateType] = useState<RateType>("effective-annual");
  const [inputRate, setInputRate] = useState<string>("");
  const [fromCompounding, setFromCompounding] = useState<string>("12");
  const [toCompounding, setToCompounding] = useState<string>("1");
  const [timePeriod, setTimePeriod] = useState<string>("1");
  const [conversions, setConversions] = useState<InterestRateConversion | null>(null);

  const handleCalculate = () => {
    const rate = parseFloat(inputRate);
    const time = parseFloat(timePeriod);
    const fromFreq = parseInt(fromCompounding);
    const toFreq = parseInt(toCompounding);

    if (isNaN(rate) || isNaN(time)) return;

    let result: InterestRateConversion;

    switch (fromRateType) {
      case "simple":
        result = convertFromSimple(rate, time, toFreq);
        break;
      case "effective-annual":
        result = convertFromEffectiveAnnual(rate, toFreq, time);
        break;
      case "nominal":
        result = convertFromNominal(rate, fromFreq, toFreq);
        break;
      default:
        result = convertFromSimple(rate, time, toFreq);
    }

    setConversions(result);
  };

  const getConvertedRate = () => {
    if (!conversions) return "0.00";
    
    switch (toRateType) {
      case "simple":
        return conversions.simple.toFixed(4);
      case "effective-annual":
        return conversions.effectiveAnnual.toFixed(4);
      case "nominal":
        return conversions.nominal.toFixed(4);
      case "effective-periodic":
        return conversions.effectivePeriodic.toFixed(4);
      case "force":
        return conversions.forceOfInterest.toFixed(4);
      default:
        return "0.00";
    }
  };

  const chartData = conversions ? [
    { name: "Simple", value: conversions.simple },
    { name: "Effective Annual", value: conversions.effectiveAnnual },
    { name: "Nominal", value: conversions.nominal },
    { name: "Effective Periodic", value: conversions.effectivePeriodic },
    { name: "Force of Interest", value: conversions.forceOfInterest }
  ] : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card className="financial-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowRight className="text-blue-600 mr-2" size={20} />
              Convert From
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fromRateType">Rate Type</Label>
              <Select value={fromRateType} onValueChange={(value) => setFromRateType(value as RateType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(rateTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="inputRate">Interest Rate (%)</Label>
              <Input
                id="inputRate"
                type="number"
                step="0.01"
                placeholder="12.50"
                value={inputRate}
                onChange={(e) => setInputRate(e.target.value)}
                className="financial-input"
              />
            </div>

            <div>
              <Label htmlFor="fromCompounding">Compounding Frequency (if applicable)</Label>
              <Select value={fromCompounding} onValueChange={setFromCompounding}>
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
              <Label htmlFor="timePeriod">Time Period (years)</Label>
              <Input
                id="timePeriod"
                type="number"
                step="0.1"
                placeholder="1"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="financial-input"
              />
            </div>
          </CardContent>
        </Card>

        {/* Output Card */}
        <Card className="financial-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowLeft className="text-green-600 mr-2" size={20} />
              Convert To
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="toRateType">Target Rate Type</Label>
              <Select value={toRateType} onValueChange={(value) => setToRateType(value as RateType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(rateTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="toCompounding">Target Compounding (if applicable)</Label>
              <Select value={toCompounding} onValueChange={setToCompounding}>
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

            <div className="financial-result">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Converted Rate:</span>
                <span className="text-xl font-bold text-green-600 font-mono">
                  {getConvertedRate()}%
                </span>
              </div>
            </div>

            <Button onClick={handleCalculate} className="w-full financial-button">
              <Calculator className="mr-2" size={16} />
              Calculate Conversion
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Results Table */}
      {conversions && (
        <Card className="financial-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="text-blue-600 mr-2" size={20} />
              All Conversions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rate Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Compounding</TableHead>
                  <TableHead>Equivalent Annual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Simple Interest</TableCell>
                  <TableCell className="font-mono text-green-600">
                    {conversions.simple.toFixed(4)}%
                  </TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell className="font-mono">
                    {conversions.simple.toFixed(4)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Effective Annual</TableCell>
                  <TableCell className="font-mono text-green-600">
                    {conversions.effectiveAnnual.toFixed(4)}%
                  </TableCell>
                  <TableCell>Annual</TableCell>
                  <TableCell className="font-mono">
                    {conversions.effectiveAnnual.toFixed(4)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Nominal</TableCell>
                  <TableCell className="font-mono text-green-600">
                    {conversions.nominal.toFixed(4)}%
                  </TableCell>
                  <TableCell>{compoundingOptions.find(opt => opt.value === toCompounding)?.label}</TableCell>
                  <TableCell className="font-mono">
                    {conversions.effectiveAnnual.toFixed(4)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Force of Interest</TableCell>
                  <TableCell className="font-mono text-green-600">
                    {conversions.forceOfInterest.toFixed(4)}%
                  </TableCell>
                  <TableCell>Continuous</TableCell>
                  <TableCell className="font-mono">
                    {conversions.effectiveAnnual.toFixed(4)}%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Visualization */}
      {conversions && (
        <Card className="financial-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="text-blue-600 mr-2" size={20} />
              Rate Comparison Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(4)}%`, "Rate"]} />
                <Bar dataKey="value" fill="#2563eb" radius={4} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}