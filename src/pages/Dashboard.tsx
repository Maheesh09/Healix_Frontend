import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  AlertTriangle,
  Calendar,
  Bell,
  TrendingUp,
  TrendingDown,
  Upload,
  Eye,
  Pill,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

// Summary cards data
const summaryCards = [
  { 
    icon: FileText, 
    label: "Total Reports", 
    value: "47", 
    color: "bg-primary/10 text-primary" 
  },
  { 
    icon: AlertTriangle, 
    label: "Active Conditions", 
    value: "2", 
    color: "bg-warning/10 text-warning" 
  },
  { 
    icon: Calendar, 
    label: "Last Upload", 
    value: "Dec 28, 2025", 
    color: "bg-info/10 text-info" 
  },
  { 
    icon: Bell, 
    label: "Health Alerts", 
    value: "1", 
    color: "bg-destructive/10 text-destructive" 
  },
];

// Recent activity data
const recentActivity = [
  { 
    icon: Upload, 
    title: "Blood Test Results uploaded", 
    subtitle: "Complete Blood Count from City Lab", 
    time: "2 hours ago" 
  },
  { 
    icon: Eye, 
    title: "Viewed cholesterol trend", 
    subtitle: "6-month trend analysis", 
    time: "Yesterday" 
  },
  { 
    icon: Pill, 
    title: "Medication reminder set", 
    subtitle: "Vitamin D supplement added", 
    time: "2 days ago" 
  },
  { 
    icon: Lightbulb, 
    title: "New health insight", 
    subtitle: "Blood pressure trending higher", 
    time: "3 days ago" 
  },
];

// Health insights data
const healthInsights = [
  {
    title: "Blood Pressure Trending Up",
    description: "Your systolic blood pressure has increased by 10 mmHg over the past 6 months. Consider lifestyle modifications.",
    color: "bg-warning/10 border-warning/20",
    iconColor: "text-warning",
  },
  {
    title: "Cholesterol Improving",
    description: "Great progress! Your total cholesterol has decreased by 20 mg/dL since July.",
    color: "bg-success/10 border-success/20",
    iconColor: "text-success",
  },
  {
    title: "Vitamin D Below Optimal",
    description: "Your Vitamin D level is 28 ng/mL, slightly below the optimal range of 30-100 ng/mL.",
    color: "bg-warning/10 border-warning/20",
    iconColor: "text-warning",
  },
];

// Biomarker data for health snapshot
const biomarkers = [
  { name: "Glucose", value: 98, unit: "mg/dL", min: 70, max: 100, status: "Normal" },
  { name: "Total Cholesterol", value: 195, unit: "mg/dL", min: 0, max: 200, status: "Normal" },
  { name: "Blood Pressure", value: 128, secondary: 82, unit: "mmHg", min: 90, max: 120, status: "Watch" },
];

const Dashboard = () => {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Welcome message */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Welcome back, M
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your health profile
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <Card key={index} className="shadow-card border-0">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="text-xl font-bold text-foreground">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Health Snapshot - Takes 2 columns */}
        <Card className="lg:col-span-2 shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Health Snapshot</CardTitle>
            <Link to="/trends" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Health Score Circle */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="hsl(var(--muted))"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="hsl(var(--primary))"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="440"
                      strokeDashoffset="66"
                      className="animate-health-score"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-primary">85</span>
                    <span className="text-sm text-muted-foreground">Health Score</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Based on your latest biomarkers</p>
              </div>

              {/* Biomarker bars */}
              <div className="space-y-4">
                {biomarkers.map((marker, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{marker.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {marker.value}
                          {marker.secondary && `/${marker.secondary}`} {marker.unit}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            marker.status === "Normal"
                              ? "bg-success/10 text-success"
                              : "bg-warning/10 text-warning"
                          }`}
                        >
                          {marker.status}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          marker.status === "Normal" ? "bg-primary" : "bg-warning"
                        }`}
                        style={{
                          width: `${((marker.value - marker.min) / (marker.max - marker.min)) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{marker.min}</span>
                      <span>Optimal range</span>
                      <span>{marker.max}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.subtitle}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Insights */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Health Insights</h2>
          <Link to="/trends" className="text-sm text-primary hover:underline flex items-center gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {healthInsights.map((insight, index) => (
            <Card key={index} className={`shadow-card border ${insight.color}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-background flex items-center justify-center flex-shrink-0`}>
                    <Lightbulb className={`h-4 w-4 ${insight.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {insight.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
