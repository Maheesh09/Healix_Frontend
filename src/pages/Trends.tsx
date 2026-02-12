import { useState, useMemo, useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/services/api";

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const biomarkerTabs = ["Glucose", "Cholesterol"];
const timeRanges = ["Days", "Months", "Years"];

// Insights (static for MVP)
const insights = [
  {
    icon: AlertCircle,
    title: "Health Alert",
    description: "Your recent readings show some fluctuations. Keep monitoring.",
    date: formatDate(today),
    color: "bg-warning/10 border-warning/20",
    iconColor: "text-warning",
  },
  {
    icon: TrendingDown,
    title: "Positive Trend",
    description: "Great job! Your health metrics are trending in the right direction.",
    date: formatDate(subDays(today, 5)),
    color: "bg-success/10 border-success/20",
    iconColor: "text-success",
  },
];

// -----------------------
// FRONTEND TREND HELPER
// -----------------------
function calculateTrend(data: { date: string; value: number }[]) {
  if (!data || data.length === 0) return "NO_DATA";
  if (data.length === 1) return "BASELINE";

  const latest = data[0].value;
  const previous = data[1].value;

  if (latest > previous) return "UP";
  if (latest < previous) return "DOWN";
  return "STABLE";
}

// -----------------------
// MAIN COMPONENT
// -----------------------
const Trends = () => {
  const { patient } = useAuth();
  const [activeBiomarker, setActiveBiomarker] = useState("Glucose");
  const [activeTimeRange, setActiveTimeRange] = useState("Months");

  // State for data records
  const [glucoseRecords, setGlucoseRecords] = useState<{ date: string; value: number }[]>([]);
  const [cholesterolRecords, setCholesterolRecords] = useState<{ date: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);

  // State for new entry form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntryDate, setNewEntryDate] = useState(formatDate(new Date()));
  const [newEntryType, setNewEntryType] = useState("Glucose");
  const [newValue1, setNewValue1] = useState("");

  useEffect(() => {
    const fetchTrendsData = async () => {
      if (!patient?.nic) return;

      setLoading(true);
      try {
        // Fetch all reports
        const res = await fetch(`${API_BASE_URL}/ocr/reports/nic/${patient.nic}?source=database`);
        if (!res.ok) throw new Error("Failed to fetch reports");
        const listData = await res.json();

        // Fetch details for each report to extract biomarkers
        // Note: For a production app with many reports, this should be optimized or paginated
        const detailsPromises = listData.reports.map((r: any) =>
          fetch(`${API_BASE_URL}/ocr/report/${patient.nic}/${r.file_id}/normalized`)
            .then(async res => {
              if (res.ok) {
                const data = await res.json();
                // Attach the created_at from the list item to the result
                return { ...data, created_at: r.created_at };
              }
              return null;
            })
            .catch(() => null)
        );

        const details = await Promise.all(detailsPromises);

        const newGlucose: { date: string; value: number }[] = [];
        const newCholesterol: { date: string; value: number }[] = [];

        details.forEach((d: any) => {
          if (!d || !d.data || !d.data.biomarkers) return;

          // Determine date: use created_at (upload date), fallback to today
          let dateStr = d.created_at || new Date().toISOString();
          const date = dateStr.split('T')[0];

          const biomarkers = d.data.biomarkers;
          let items: any[] = [];
          if (Array.isArray(biomarkers)) items = biomarkers;
          else if (typeof biomarkers === 'object') items = Object.values(biomarkers);

          // Extract Glucose
          const glucoseItem = items.find((b: any) => {
            const name = b.name?.toLowerCase() || "";
            return name.includes("glucose") || name.includes("fbs") || name.includes("fasting");
          });

          if (glucoseItem && !isNaN(parseFloat(glucoseItem.value))) {
            newGlucose.push({ date, value: parseFloat(glucoseItem.value) });
          }

          // Extract Cholesterol
          const cholesterolItem = items.find((b: any) => {
            const name = b.name?.toLowerCase() || "";
            return name.includes("total cholesterol") || (name.includes("cholesterol") && !name.includes("hdl") && !name.includes("ldl"));
          });

          if (cholesterolItem && !isNaN(parseFloat(cholesterolItem.value))) {
            newCholesterol.push({ date, value: parseFloat(cholesterolItem.value) });
          }
        });

        // Sort by date ascending for the chart
        newGlucose.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        newCholesterol.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setGlucoseRecords(newGlucose);
        setCholesterolRecords(newCholesterol);
      } catch (err) {
        console.error("Error fetching trend data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendsData();
  }, [patient?.nic]);

  const handleAddEntry = () => {
    const date = newEntryDate;
    const val1 = parseFloat(newValue1);

    if (isNaN(val1)) return;

    if (newEntryType === "Glucose") {
      setGlucoseRecords(prev => [...prev, { date, value: val1 }].sort((a, b) => a.date.localeCompare(b.date)));
    } else if (newEntryType === "Cholesterol") {
      setCholesterolRecords(prev => [...prev, { date, value: val1 }].sort((a, b) => a.date.localeCompare(b.date)));
    }

    setIsDialogOpen(false);
    setNewValue1("");
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
    let filteredRecs: any[] = [];
    switch (activeBiomarker) {
      case "Cholesterol":
        filteredRecs = getFilteredData(cholesterolRecords, activeTimeRange);
        return {
          data: filteredRecs,
          unit: "mg/dL",
          domain: [100, 300], // Adjusted/widened default domain
          lines: [
            { key: "value", name: "Total Cholesterol", color: "hsl(var(--primary))" }
          ],
          refs: [{ y: 200, label: "High" }]
        };
      case "Glucose":
      default:
        filteredRecs = getFilteredData(glucoseRecords, activeTimeRange);
        return {
          data: filteredRecs,
          unit: "mg/dL",
          domain: [60, 200], // Adjusted/widened default domain
          lines: [
            { key: "value", name: "Glucose", color: "hsl(var(--primary))" }
          ],
          refs: [{ y: 100, label: "High" }, { y: 70, label: "Low" }]
        };
    }
  }, [activeBiomarker, activeTimeRange, glucoseRecords, cholesterolRecords]);

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
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value1">
                  Value (mg/dL)
                </Label>
                <Input
                  id="value1"
                  type="number"
                  placeholder="e.g. 120"
                  value={newValue1}
                  onChange={(e) => setNewValue1(e.target.value)}
                />
              </div>
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
        <div className="flex gap-2">
          {biomarkerTabs.map(tab => (
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
        <div className="flex gap-1 bg-muted rounded-full p-1">
          {timeRanges.map(range => (
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
                {loading ? (
                  <span className="text-sm text-muted-foreground">Loading...</span>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-foreground">{lastValueDisplay}</span>
                    <span className="text-sm text-muted-foreground">{config.unit}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isImprovement ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'} flex items-center gap-1`}>
                      {isImprovement ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                      {trendDisplay}%
                    </span>
                  </>
                )}
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
                ))}

                {config.lines.map((line) => (
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
