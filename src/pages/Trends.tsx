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

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const biomarkerTabs = ["Glucose", "Cholesterol", "Blood Pressure"];
const timeRanges = ["Days", "Months", "Years"];

// Insights (Dynamic based on data would be ideal, initially empty)
const insights: any[] = [];

// -----------------------
// FRONTEND TREND HELPER
// -----------------------

// -----------------------
// MAIN COMPONENT
// -----------------------
const Trends = () => {
  const { patient } = useAuth();
  const [activeBiomarker, setActiveBiomarker] = useState("Glucose");
  const [activeTimeRange, setActiveTimeRange] = useState("Months");

  // State for data records
  const [glucoseRecords, setGlucoseRecords] = useState<any[]>([]);
  const [cholesterolRecords, setCholesterolRecords] = useState<any[]>([]);
  const [bpRecords, setBpRecords] = useState<any[]>([]);
  const [availableBiomarkers, setAvailableBiomarkers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // State for new entry form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntryDate, setNewEntryDate] = useState(formatDate(new Date()));
  const [newEntryType, setNewEntryType] = useState("Glucose");
  const [newValue1, setNewValue1] = useState("");
  const [newValue2, setNewValue2] = useState("");

  const fetchTrendData = async () => {
    if (!patient?.id) return;
    setIsLoading(true);
    try {
      // 1. Get available names
      const namesRes = await fetch(`${API_BASE_URL}/trends/names?patient_id=${patient.id}`);
      console.log("namesRes",namesRes);
      
      let names: string[] = [];
      if (namesRes.ok) {
        names = await namesRes.json();
        setAvailableBiomarkers(names);
      } else {
        const errText = await namesRes.text().catch(() => "");
        console.error("Failed to load biomarker names:", namesRes.status, errText);
      }

      const findName = (keywords: string[]) => names.find(n => keywords.some(k => n.toLowerCase().includes(k.toLowerCase())));

      // 2. Fetch Glucose
      const gluName = findName(["Glucose", "Sugar", "FBS", "Fasting Plasma Glucose"]);
      if (gluName) {
         const res = await fetch(`${API_BASE_URL}/trends/data?patient_id=${patient.id}&name=${encodeURIComponent(gluName)}`);
         if (res.ok) {
           const data = await res.json();
           setGlucoseRecords(data.data_points || []);
         }
      } else {
        setGlucoseRecords([]);
      }

      // 3. Fetch Cholesterol
      const cholName = findName(["Total Cholesterol", "Cholesterol"]);
      if (cholName) {
         const res = await fetch(`${API_BASE_URL}/trends/data?patient_id=${patient.id}&name=${encodeURIComponent(cholName)}`);
         if (res.ok) {
           const data = await res.json();
           setCholesterolRecords(data.data_points || []);
         }
      } else {
        setCholesterolRecords([]);
      }

      // 4. Fetch BP (Systolic & Diastolic)
      const sysName = findName(["Systolic", "Sys BP"]);
      const diaName = findName(["Diastolic", "Dia BP"]);

      if (sysName || diaName) {
          const sysN = sysName || "Systolic BP";
          const diaN = diaName || "Diastolic BP";
          const [sRes, dRes] = await Promise.all([
              fetch(`${API_BASE_URL}/trends/data?patient_id=${patient.id}&name=${encodeURIComponent(sysN)}`),
              fetch(`${API_BASE_URL}/trends/data?patient_id=${patient.id}&name=${encodeURIComponent(diaN)}`)
          ]);

          if (sRes.ok && dRes.ok) {
              const sData = (await sRes.json()).data_points || [];
              const dData = (await dRes.json()).data_points || [];

              const bpMap = new Map();
              sData.forEach((d: any) => {
                  const date = d.date.split('T')[0];
                  if (!bpMap.has(date)) bpMap.set(date, { date });
                  bpMap.get(date).systolic = d.value;
              });
              dData.forEach((d: any) => {
                  const date = d.date.split('T')[0];
                  if (!bpMap.has(date)) bpMap.set(date, { date });
                  bpMap.get(date).diastolic = d.value;
              });

              const merged = Array.from(bpMap.values())
                  .filter((d: any) => d.systolic !== undefined && d.diastolic !== undefined)
                  .sort((a: any, b: any) => a.date.localeCompare(b.date));
              
              setBpRecords(merged);
          }
      } else {
        setBpRecords([]);
      }

    } catch (error) {
      console.error("Error fetching trend data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendData();
  }, [patient?.id]);

  // Map frontend tab names to backend metric_names
  const metricNameMap: Record<string, string> = {
    "Glucose": "Fasting Plasma Glucose",
    "Cholesterol": "Total Cholesterol",
    "Blood Pressure": "" // handled as two entries: Systolic BP + Diastolic BP
  };

  const saveHealthMetric = async (metricName: string, value: number, date: string) => {
    if (!patient?.id) return;
    try {
      // Ensure a stable ISO datetime (UTC midnight for the selected date)
      const recordedAtIso = `${date}T00:00:00.000Z`;
      const res = await fetch(`${API_BASE_URL}/health/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          user_id: patient.id,
          metric_name: metricName,
          value: Number(value),
          recorded_at: recordedAtIso,
        }),
      });

      // Parse response for better error visibility
      const payload = await res.json().catch(async () => ({ detail: await res.text().catch(() => "") }));
      if (!res.ok) {
        console.error("Save metric failed:", res.status, payload?.detail ?? payload);
        throw new Error(typeof payload?.detail === "string" ? payload.detail : "Failed to save metric");
      }
      return payload;
    } catch (err) {
      console.error("Failed to save metric:", err);
      throw err;
    }
  };

  const handleAddEntry = async () => {
    const date = newEntryDate;
    const val1 = parseFloat(newValue1);
    const val2 = parseFloat(newValue2);

    if (isNaN(val1) || !patient?.id) return;

    if (newEntryType === "Glucose") {
      await saveHealthMetric("Fasting Plasma Glucose", val1, date);
    } else if (newEntryType === "Cholesterol") {
      await saveHealthMetric("Total Cholesterol", val1, date);
    } else if (newEntryType === "Blood Pressure") {
      if (isNaN(val2)) return;
      await saveHealthMetric("Systolic BP", val1, date);
      await saveHealthMetric("Diastolic BP", val2, date);
    }

    // Re-fetch data from backend so chart updates with persisted data
    await fetchTrendData();

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

      const row: any = { month: label, fullDate: d.date, timestamp: dateObj.getTime() }; // Keep full date for key
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
      let nextTimestamp = 0;
      if (activeTimeRange === "Days") {
        const nextD = subDays(lastDate, -1);
        nextLabel = format(nextD, "MMM dd");
        nextTimestamp = nextD.getTime();
      } else if (activeTimeRange === "Months") {
         const nextD = subMonths(lastDate, -1);
         nextLabel = format(nextD, "MMM");
         nextTimestamp = nextD.getTime();
      } else {
         const nextD = subYears(lastDate, -1);
         nextLabel = format(nextD, "yyyy");
         nextTimestamp = nextD.getTime();
      }

      const predRow: any = { month: nextLabel + " (Est)", timestamp: nextTimestamp };
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
          <p className="text-muted-foreground">            Track how your biomarkers change over time          </p>
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
                  dataKey="timestamp"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(unixTime) => {
                    const date = new Date(unixTime);
                    if (activeTimeRange === "Days") return format(date, "MMM dd");
                    if (activeTimeRange === "Months") return format(date, "MMM");
                    return format(date, "yyyy");
                  }}
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
