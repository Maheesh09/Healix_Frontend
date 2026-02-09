import { useEffect, useState } from "react";
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
  Download,
} from "lucide-react";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedReport, setExpandedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      let nic = localStorage.getItem("NIC");
      if (nic) nic = nic.replace(/^"|"$/g, "");

      if (!nic) {
        setError("NIC not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        // 1️⃣ Fetch reports list
        const res = await fetch(
          `http://127.0.0.1:8000/api/v1/ocr/reports/nic/${nic}`
        );

        if (!res.ok) throw new Error("Failed to fetch reports list");

        const listData = await res.json();

        // 2️⃣ Fetch normalized reports in parallel
        const detailedReports = await Promise.all(
          listData.reports.map(async (report, index) => {
            const detailRes = await fetch(
              `http://127.0.0.1:8000/api/v1/ocr/report/${nic}/${report.file_id}/normalized`
            );

            if (!detailRes.ok) return null;

            const detailData = await detailRes.json();

            return {
              id: index + 1,
              name: detailData.data.report.type,
              lab:
                listData.source === "storage"
                  ? "Cloud Storage"
                  : "Hospital Database",
              date: new Date(report.created).toLocaleDateString(),
              values: [
                { name: "File Type", value: report.type },
                {
                  name: "Size",
                  value: `${(report.size_bytes / 1024).toFixed(1)} KB`,
                },
              ],
              status: "Normal",
              aiSummary: `Report for ${detailData.data.patient.name}, Age ${detailData.data.patient.age_years}.`,
              fileId: report.file_id,
              biomarkers: detailData.data.biomarkers,
            };
          })
        );

        setReports(detailedReports.filter(Boolean));
      } catch (err) {
        console.error(err);
        setError("Unable to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const toggleExpand = (id) => {
    setExpandedReport(expandedReport === id ? null : id);
  };

  const getStatusStyle = (status) => {
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

  if (loading) return <p className="p-6">Loading reports...</p>;
  if (error) return <p className="p-6 text-destructive">{error}</p>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          View and manage all your medical reports
        </p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl"
          />
        </div>
        <Button variant="outline" className="h-11 rounded-xl gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="space-y-4">
        {reports
          .filter(
            (r) =>
              r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              r.date.includes(searchQuery) ||
              r.fileId.includes(searchQuery)
          )
          .map((report) => (
            <Card key={report.id} className="shadow-card border-0">
              <CardContent className="p-0">
                <div
                  className="p-4 flex justify-between cursor-pointer hover:bg-muted/30"
                  onClick={() => toggleExpand(report.id)}
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{report.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {report.lab} • {report.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full border ${getStatusStyle(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                    {expandedReport === report.id ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </div>
                </div>

                {expandedReport === report.id && (
                  <div className="px-4 pb-4 border-t">
                    <div className="pt-4 space-y-4">
                      <div className="flex gap-4">
                        {report.values.map((val, idx) => (
                          <div
                            key={idx}
                            className="flex-1 p-3 rounded-xl bg-secondary/50"
                          >
                            <p className="text-xs text-muted-foreground">
                              {val.name}
                            </p>
                            <p className="text-lg font-bold">{val.value}</p>
                          </div>
                        ))}
                      </div>

                      <p className="text-sm bg-muted/30 p-3 rounded-xl">
                        {report.aiSummary}
                      </p>

                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-4 w-4" />
                          View Full Report
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
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
