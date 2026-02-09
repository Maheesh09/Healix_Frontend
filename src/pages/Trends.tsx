import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingDown, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// Tabs
const biomarkerTabs = ["Cholesterol"];
const timeRanges = ["3M", "6M", "1Y"];

// Insights (static for MVP)
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

// -----------------------
// FRONTEND TREND HELPER
// -----------------------
function calculateTrend(data) {
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
  const [activeBiomarker, setActiveBiomarker] = useState("Cholesterol");
  const [activeTimeRange, setActiveTimeRange] = useState("6M");
  const [chartData, setChartData] = useState([]);
  const [trend, setTrend] = useState("BASELINE");
  const [currentValue, setCurrentValue] = useState(null);

  useEffect(() => {
    async function loadBiomarkerTrend() {
      try {
        const nic = "623370194V"; // replace with dynamic NIC if needed

        // 1️⃣ fetch report list
        const listRes = await fetch(`http://127.0.0.1:8000/api/v1/ocr/reports/nic/${nic}`);
        const listJson = await listRes.json();

        // 2️⃣ fetch each report
        const reports = await Promise.all(
          listJson.reports.map(async (r) => {
            const res = await fetch(
              `http://127.0.0.1:8000/api/v1/ocr/report/${nic}/${r.file_id}/normalized`
            );
            return res.json();
          })
        );

        // 3️⃣ extract the biomarker data (e.g., Total Cholesterol)
        const extracted = reports
          .filter(r => r?.data?.report?.sample_collected_at)
          .map(r => {
            const biomarker = r.data.biomarkers.find(
              b => b.name === "Total Cholesterol"
            );
            if (!biomarker) return null;
            return {
              date: r.data.report.sample_collected_at,
              value: biomarker.value,
            };
          })
          .filter(Boolean)
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        // 4️⃣ normalize for chart
setChartData(
  [
    { month: "Start", value: 180 }, // start from zero
    ...extracted.map(e => ({
      month: new Date(e.date).toLocaleString("default", { month: "short" }),
      value: e.value,
    })),
  ]
);

        // 5️⃣ set current value and trend
        setCurrentValue(extracted[0]?.value ?? null);
        setTrend(calculateTrend(extracted));
      } catch (err) {
        console.error("Error fetching trend data:", err);
      }
    }

    loadBiomarkerTrend();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Trends & Analytics</h1>
        <p className="text-muted-foreground">Track how your biomarkers change over time</p>
      </div>

      {/* Biomarker & Time Range Tabs */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          {biomarkerTabs.map(tab => (
            <Button
              key={tab}
              variant={activeBiomarker === tab ? "default" : "outline"}
              className={`rounded-full ${
                activeBiomarker === tab
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
              className={`rounded-full px-4 ${
                activeTimeRange === range
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
              <p className="text-sm text-muted-foreground">Showing last 6 months</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {currentValue ?? "--"}
                </span>
                <span className="text-sm text-muted-foreground">mg/dL</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted flex items-center gap-1">
                  {trend === "UP" && "⬆️"}
                  {trend === "DOWN" && "⬇️"}
                  {trend === "STABLE" && "➡️"}
                  {trend === "BASELINE" && "●"}
                  {trend}
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
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <Card key={index} className={`shadow-card border ${insight.color}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center flex-shrink-0">
                    <insight.icon className={`h-4 w-4 ${insight.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {insight.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                      {insight.description}
                    </p>
                    <p className="text-xs text-muted-foreground">{insight.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

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
