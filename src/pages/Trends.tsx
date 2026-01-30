import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingDown, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// Mock glucose data
const glucoseData = [
  { month: "Jul", value: 105 },
  { month: "Aug", value: 102 },
  { month: "Sep", value: 98 },
  { month: "Oct", value: 96 },
  { month: "Nov", value: 95 },
  { month: "Dec", value: 98 },
];

const biomarkerTabs = ["Glucose", "Cholesterol", "Blood Pressure"];
const timeRanges = ["3M", "6M", "1Y"];

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
  const [activeTimeRange, setActiveTimeRange] = useState("6M");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Trends & Analytics</h1>
        <p className="text-muted-foreground">Track how your biomarkers change over time</p>
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
              <p className="text-sm text-muted-foreground">Showing last 6 months</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">98</span>
                <span className="text-sm text-muted-foreground">mg/dL</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  6.7%
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={glucoseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={[0, 120]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <ReferenceLine
                  y={100}
                  stroke="hsl(var(--destructive))"
                  strokeDasharray="5 5"
                  label={{ value: "High", position: "right", fill: "hsl(var(--destructive))", fontSize: 10 }}
                />
                <ReferenceLine
                  y={70}
                  stroke="hsl(var(--destructive))"
                  strokeDasharray="5 5"
                  label={{ value: "Low", position: "right", fill: "hsl(var(--destructive))", fontSize: 10 }}
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
