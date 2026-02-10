import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lightbulb, TrendingDown, AlertCircle, TrendingUp, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { predictNextValue } from "@/lib/utils";
import { format, subDays, subMonths, subYears, parseISO } from "date-fns";

// Initial Mock data with full dates for filtering flexibility
// Using a fixed recent date for reproducible output relative to "now"
const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const initialGlucose = [
  { date: "2023-07-15", value: 105 },
  { date: "2023-08-15", value: 102 },
  { date: "2023-09-15", value: 98 },
  { date: "2023-10-15", value: 96 },
  { date: "2023-11-15", value: 95 },
  { date: "2023-12-15", value: 98 },
].map(d => ({ ...d, date: formatDate(subMonths(today, 6 - ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(d.date.split('-')[1]))) })); // Approximate for demo

// Resetting strict mock dates to rely on relative calc for better UX
const generateMockData = () => {
  const d = new Date();
  const data = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(d, i);
    data.push({
      date: formatDate(date),
      value: 100 + Math.floor(Math.random() * 10) - 5
    });
  }
  return data;
};

const generateBPMockData = () => {
  const d = new Date();
  const data = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(d, i);
    data.push({
      date: formatDate(date),
      systolic: 120 + Math.floor(Math.random() * 10),
      diastolic: 80 + Math.floor(Math.random() * 5)
    });
  }
  return data;
};

const initialCholesterol = generateMockData().map(d => ({...d, value: 180 + Math.floor(Math.random() * 20)}));
const initialGlucoseData = generateMockData().map(d => ({...d, value: 95 + Math.floor(Math.random() * 10)}));
const initialBP = generateBPMockData();


const biomarkerTabs = ["Glucose", "Cholesterol", "Blood Pressure"];
const timeRanges = ["Days", "Months", "Years"];

const insights = [
  {
    icon: AlertCircle,
    title: "Blood Pressure Trending Up",
    description: "Your systolic blood pressure has increased by 10 mmHg over the past 6 months. Consider lifestyle modifications.",
    date: "2025-12-28",
    color: "bg-warning/10 border-warning/20",
    iconColor: "text-warning",
  },
  {
    icon: TrendingDown,
    title: "Cholesterol Improving",
    description: "Great progress! Your total cholesterol has decreased by 20 mg/dL since July.",
    date: "2025-12-20",
    color: "bg-success/10 border-success/20",
    iconColor: "text-success",
  },
];

const Trends = () => {
  const [activeBiomarker, setActiveBiomarker] = useState("Glucose");
  const [activeTimeRange, setActiveTimeRange] = useState("Months");
  
  // State for data records
  const [glucoseRecords, setGlucoseRecords] = useState(initialGlucoseData);
  const [cholesterolRecords, setCholesterolRecords] = useState(initialCholesterol);
  const [bpRecords, setBpRecords] = useState(initialBP);

  // State for new entry form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntryDate, setNewEntryDate] = useState(formatDate(new Date()));
  const [newEntryType, setNewEntryType] = useState("Glucose");
  const [newValue1, setNewValue1] = useState("");
  const [newValue2, setNewValue2] = useState("");

  const handleAddEntry = () => {
      const date = newEntryDate;
      const val1 = parseFloat(newValue1);
      const val2 = parseFloat(newValue2);

      if (isNaN(val1)) return;

      if (newEntryType === "Glucose") {
          setGlucoseRecords(prev => [...prev, { date, value: val1 }].sort((a, b) => a.date.localeCompare(b.date)));
      } else if (newEntryType === "Cholesterol") {
          setCholesterolRecords(prev => [...prev, { date, value: val1 }].sort((a, b) => a.date.localeCompare(b.date)));
      } else if (newEntryType === "Blood Pressure") {
          if (isNaN(val2)) return;
          setBpRecords(prev => [...prev, { date, systolic: val1, diastolic: val2 }].sort((a, b) => a.date.localeCompare(b.date)));
      }
      setIsDialogOpen(false);
      setNewValue1("");
      setNewValue2("");
  };

  const getFilteredData = (records: any[], range: string) => {
      const now = new Date();
      let startDate = subMonths(now, 6); // Default

      if (range === "Days") startDate = subDays(now, 30);
      else if (range === "Months") startDate = subMonths(now, 12);
      else if (range === "Years") startDate = subYears(now, 5);

      return records.filter(r => new Date(r.date) >= startDate);
  };

  const config = useMemo(() => {
    let filteredRecs = [];
    switch (activeBiomarker) {
      case "Cholesterol":
        filteredRecs = getFilteredData(cholesterolRecords, activeTimeRange);
        return {
          data: filteredRecs,
          unit: "mg/dL",
          domain: [100, 240],
          lines: [
            { key: "value", name: "Total Cholesterol", color: "hsl(var(--primary))" }
          ],
          refs: [{ y: 200, label: "High" }]
        };
      case "Blood Pressure":
        filteredRecs = getFilteredData(bpRecords, activeTimeRange);
        return {
          data: filteredRecs,
          unit: "mmHg",
          domain: [60, 160],
          lines: [
            { key: "systolic", name: "Systolic", color: "hsl(var(--destructive))" },
            { key: "diastolic", name: "Diastolic", color: "hsl(var(--primary))" }
          ],
          refs: [{ y: 120, label: "Normal Sys" }, { y: 80, label: "Normal Dia" }]
        };
      case "Glucose":
      default:
        filteredRecs = getFilteredData(glucoseRecords, activeTimeRange);
        return {
          data: filteredRecs,
          unit: "mg/dL",
          domain: [60, 140],
          lines: [
            { key: "value", name: "Glucose", color: "hsl(var(--primary))" }
          ],
          refs: [{ y: 100, label: "High" }, { y: 70, label: "Low" }]
        };
    }
  }, [activeBiomarker, activeTimeRange, glucoseRecords, cholesterolRecords, bpRecords]);

  const { chartData, lastValueDisplay, trendDisplay, isImprovement } = useMemo(() => {
    const rawData = config.data;
    const lines = config.lines;
    
    if (rawData.length === 0) return { chartData: [], lastValueDisplay: "N/A", trendDisplay: "0", isImprovement: false };

    // Calculate last values and predictions for each line
    const processedLines = lines.map(line => {
      // @ts-ignore
      const values = rawData.map(d => d[line.key] as number);
      const prediction = predictNextValue(values);
      const firstVal = values[0];
      const lastVal = values[values.length - 1];
      const percentage = firstVal !== 0 ? ((lastVal - firstVal) / firstVal) * 100 : 0;
      
      return {
        ...line,
        lastVal,
        percentage,
        prediction
      };
    });

    // Determine overall trend (using primary line - usually the first one)
    const primaryLine = processedLines[0];
    const percentage = primaryLine.percentage;
    const isImprovement = percentage < 0; // Assuming lower is better for all these

    // Prepare chart data rows
    const dataWithPrediction = rawData.map((d, i) => {
      const dateObj = new Date(d.date);
      let label = "";
      if (activeTimeRange === "Days") label = format(dateObj, "MMM dd");
      else if (activeTimeRange === "Months") label = format(dateObj, "MMM");
      else label = format(dateObj, "yyyy");

      const row: any = { month: label, fullDate: d.date }; // Keep full date for key
      processedLines.forEach(line => {
        // @ts-ignore
        row[line.key] = d[line.key];
      });
      return row;
    });

    // Add prediction row
    if (dataWithPrediction.length > 0) {
        const lastDate = new Date(dataWithPrediction[dataWithPrediction.length - 1].fullDate);
        let nextLabel = "Future";
        if (activeTimeRange === "Days") nextLabel = format(subDays(lastDate, -1), "MMM dd");
        else if (activeTimeRange === "Months") nextLabel = format(subMonths(lastDate, -1), "MMM");
        else nextLabel = format(subYears(lastDate, -1), "yyyy");

        const predRow: any = { month: nextLabel + " (Est)" };
        processedLines.forEach(line => {
           predRow[`${line.key}_predicted`] = Math.round(line.prediction);
        });
        
        // Connect lines
        const lastRealRow = dataWithPrediction[dataWithPrediction.length - 1];
        processedLines.forEach(line => {
           // @ts-ignore
           lastRealRow[`${line.key}_predicted`] = lastRealRow[line.key];
        });

        dataWithPrediction.push(predRow);
    }

    // Format display string
    let lastValueDisplay = `${primaryLine.lastVal}`;
    if (processedLines.length > 1) {
       lastValueDisplay = processedLines.map(l => l.lastVal).join("/");
    }

    return {
      chartData: dataWithPrediction,
      lastValueDisplay,
      trendDisplay: Math.abs(percentage).toFixed(1),
      isImprovement
    };
  }, [config, activeTimeRange]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Trends & Analytics</h1>
          <p className="text-muted-foreground">Track how your biomarkers change over time</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Health Record</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEntryDate}
                  onChange={(e) => setNewEntryDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select value={newEntryType} onValueChange={setNewEntryType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Glucose">Glucose</SelectItem>
                    <SelectItem value="Cholesterol">Cholesterol</SelectItem>
                    <SelectItem value="Blood Pressure">Blood Pressure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value1">
                   {newEntryType === "Blood Pressure" ? "Systolic (mmHg)" : "Value (mg/dL)"}
                </Label>
                <Input
                  id="value1"
                  type="number"
                  placeholder="e.g. 120"
                  value={newValue1}
                  onChange={(e) => setNewValue1(e.target.value)}
                />
              </div>
              {newEntryType === "Blood Pressure" && (
                <div className="grid gap-2">
                  <Label htmlFor="value2">Diastolic (mmHg)</Label>
                  <Input
                    id="value2"
                    type="number"
                    placeholder="e.g. 80"
                    value={newValue2}
                    onChange={(e) => setNewValue2(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddEntry}>Save Record</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Biomarker and Time Range Tabs */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Biomarker tabs */}
        <div className="flex gap-2">
          {biomarkerTabs.map((tab) => (
            <Button
              key={tab}
              variant={activeBiomarker === tab ? "default" : "outline"}
              className={`rounded-full ${activeBiomarker === tab
                  ? "bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
                }`}
              onClick={() => setActiveBiomarker(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Time range tabs */}
        <div className="flex gap-1 bg-muted rounded-full p-1">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant="ghost"
              size="sm"
              className={`rounded-full px-4 ${activeTimeRange === range
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
              onClick={() => setActiveTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart Card */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">{activeBiomarker}</CardTitle>
              <p className="text-sm text-muted-foreground">Showing last {activeTimeRange}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">{lastValueDisplay}</span>
                <span className="text-sm text-muted-foreground">{config.unit}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isImprovement ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'} flex items-center gap-1`}>
                  {isImprovement ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                  {trendDisplay}%
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={config.domain}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                {config.refs.map((ref, idx) => (
                  <ReferenceLine
                    key={idx}
                    y={ref.y}
                    stroke="hsl(var(--destructive))"
                    strokeDasharray="5 5"
                    label={{ value: ref.label, position: "right", fill: "hsl(var(--destructive))", fontSize: 10 }}
                  />
                ))}
                
                {config.lines.map((line) => (
                  <>
                     {/* Historical Line */}
                    <Line
                      key={line.key}
                      type="monotone"
                      dataKey={line.key}
                      name={line.name}
                      stroke={line.color}
                      strokeWidth={2}
                      dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: line.color }}
                    />
                    {/* Predicted Line Segment */}
                    <Line
                      key={`${line.key}_pred`}
                      type="monotone"
                      dataKey={`${line.key}_predicted`}
                      name={`${line.name} (Predicted)`}
                      stroke={line.color}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "hsl(var(--background))", stroke: line.color, strokeWidth: 2, r: 4 }}
                      activeDot={false}
                    />
                  </>
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      
      {/* Disclaimer */}
      <Card className="bg-warning/5 border-warning/20">
        <CardContent className="p-4">
          <p className="text-sm text-center text-muted-foreground">
            <strong>Note:</strong> These insights are for informational purposes only. Always consult your healthcare provider for medical advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Trends;
