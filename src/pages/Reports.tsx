import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  FileText,
  ChevronDown,
  ChevronUp,
  Eye,
  Download
} from "lucide-react";

// Mock reports data
const reports = [
  {
    id: 1,
    name: "Complete Blood Count",
    lab: "City Diagnostic Lab",
    date: "12/28/2025",
    system: "Blood",
    values: [
      { name: "Hemoglobin", value: "14.2" },
      { name: "WBC", value: "7.5" },
    ],
    status: "Normal",
    aiSummary: "All blood count values are within normal range. No concerns detected.",
  },
  {
    id: 2,
    name: "Lipid Panel",
    lab: "Metro Health Labs",
    date: "12/20/2025",
    system: "Heart",
    values: [
      { name: "Total Cholesterol", value: "195" },
      { name: "LDL", value: "110" },
    ],
    status: "Normal",
    aiSummary: "Cholesterol levels are within acceptable range. Continue healthy lifestyle.",
  },
  {
    id: 3,
    name: "Blood Pressure Monitoring",
    lab: "Home Monitoring",
    date: "12/28/2025",
    system: "Heart",
    values: [
      { name: "Systolic", value: "128 mmHg" },
      { name: "Diastolic", value: "82 mmHg" },
    ],
    status: "Watch",
    aiSummary: "Blood pressure is slightly elevated. Continue monitoring and consider lifestyle adjustments.",
  },
];

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedReport, setExpandedReport] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedReport(expandedReport === id ? null : id);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-success/10 text-success border-success/20";
      case "Watch":
        return "bg-warning/10 text-warning border-warning/20";
      case "Alert":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground">View and manage all your medical reports</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl border-border bg-card"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <Button variant="outline" className="h-11 rounded-xl border-border gap-2 whitespace-nowrap">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters:</span>
          </Button>
          <Button variant="outline" className="h-11 rounded-xl border-border gap-2 whitespace-nowrap">
            All Types
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="h-11 rounded-xl border-border gap-2 whitespace-nowrap">
            All Years
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="h-11 rounded-xl border-border gap-2 whitespace-nowrap">
            All Systems
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="shadow-card border-0 overflow-hidden">
            <CardContent className="p-0">
              {/* Report Header - Always visible */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleExpand(report.id)}
              >
                <div className="flex items-center gap-4  max-w-[calc(100%-80px)]">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{report.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {report.lab} • {report.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {report.values.map((val, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary hidden xl:inline-block"
                    >
                      {val.name}: {val.value}
                    </span>
                  ))}
                  <span
                    className={`text-xs px-3 py-1 rounded-full border hidden sm:inline-block ${getStatusStyle(
                      report.status
                    )}`}
                  >
                    {report.status}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full sm:hidden ${report.status === "Normal" ? "bg-success" : report.status === "Alert" ? "bg-destructive" : "bg-warning"
                      }`}
                  />
                  {expandedReport === report.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedReport === report.id && (
                <div className="px-4 pb-4 pt-0 border-t border-border">
                  <div className="pt-4 space-y-4">
                    {/* Key Values */}
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Key Values</h4>
                      <div className="flex gap-4">
                        {report.values.map((val, idx) => (
                          <div
                            key={idx}
                            className="flex-1 p-3 rounded-xl bg-secondary/50"
                          >
                            <p className="text-xs text-muted-foreground">{val.name}</p>
                            <p className="text-lg font-bold text-foreground">{val.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Summary */}
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">
                        AI Summary (Simple Language)
                      </h4>
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl">
                        {report.aiSummary}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="rounded-xl gap-2">
                        <Eye className="h-4 w-4" />
                        View Full Report
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;
