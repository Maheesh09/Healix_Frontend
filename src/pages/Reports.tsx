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
import { API_BASE_URL } from "@/services/api";


import { useAuth } from "@/contexts/AuthContext";

const Reports = () => {
  const { patient } = useAuth();
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedReport, setExpandedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      const nic = patient?.nic;

      if (!nic) {
        // Only show error if we've determined there is no NIC but we expected one
        // Or just clear the reports and stop loading
        setReports([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // 1️⃣ Fetch reports list from Database (Much Faster)
        const res = await fetch(
          `${API_BASE_URL}/ocr/reports/nic/${nic}?source=database`
        );

        if (!res.ok) throw new Error("Failed to fetch reports list");

        const listData = await res.json();

        // 2️⃣ Map partial data initially
        const initialReports = listData.reports.map((report) => ({
          id: report.id,
          name: report.report_type || "Medical Report",
          lab: "Hospital Database",
          date: new Date(report.created_at).toLocaleDateString(),
          values: [
            { name: "File Type", value: "PDF" },
            { name: "Status", value: "Processed" },
          ],
          status: "Normal", // Default, will update
          aiSummary: null, // Loaded on demand
          fileId: report.file_id,
          biomarkers: null, // Loaded on demand
        }));

        setReports(initialReports);
        setError(null);

        // Background update for statuses
        initialReports.forEach(async (report) => {
          try {
            const detailRes = await fetch(`${API_BASE_URL}/ocr/report/${nic}/${report.fileId}/normalized`);
            if (!detailRes.ok) return;
            const detailData = await detailRes.json();

            const reportType = (detailData.data.report?.type || report.name).toLowerCase();
            let newStatus = "Normal";

            const checkValue = (name: string, value: any) => {
              const valNum = parseFloat(value);
              if (isNaN(valNum)) return null;
              const lowerName = name.toLowerCase();

              if (lowerName.includes("glucose") || lowerName.includes("fbs") || lowerName.includes("fasting")) {
                if (valNum >= 126) return "Alert";
                if (valNum >= 100) return "Watch";
                return "Normal";
              }

              if (lowerName.includes("cholesterol") || lowerName.includes("total")) {
                if (valNum >= 240) return "Alert";
                if (valNum >= 200) return "Watch";
                return "Normal";
              }
              return null;
            };

            if (reportType.includes("blood count") || reportType.includes("fbc") || reportType.includes("cbc")) {
              newStatus = "";
            } else {
              let worstStatus = "Normal";
              // Extract vals similar to toggleExpand logic to be safe
              const biomarkers = detailData.data.biomarkers;
              let items = [];
              if (Array.isArray(biomarkers)) items = biomarkers;
              else if (typeof biomarkers === 'object' && biomarkers) items = Object.entries(biomarkers).map(([k, v]) => ({ name: k, value: (v as any)?.value || v }));

              for (const item of items) {
                const s = checkValue(item.name, item.value);
                if (s === "Alert") { worstStatus = "Alert"; break; }
                if (s === "Watch") worstStatus = "Watch";
              }
              newStatus = worstStatus;
            }

            setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: newStatus } : r));
          } catch (e) {
            console.error("Bg update fail", e);
          }
        });

      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unable to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [patient]);

  const toggleExpand = async (id) => {
    // 1Toggle Expansion
    const isExpanding = expandedReport !== id;
    setExpandedReport(isExpanding ? id : null);

    if (!isExpanding) return;

    // Lazy Load Details if missing
    const reportIndex = reports.findIndex((r) => r.id === id);
    if (reportIndex === -1) return;

    const report = reports[reportIndex];
    if (report.aiSummary && report.biomarkers) return; // Already loaded

    try {
      const nic = patient?.nic;
      if (!nic) return;

      const detailRes = await fetch(
        `${API_BASE_URL}/ocr/report/${nic}/${report.fileId}/normalized`
      );

      if (detailRes.ok) {
        const detailData = await detailRes.json();

        // Construct summary from detailed data
        const aiSummary = `Report for ${detailData.data.patient.name}, Age ${detailData.data.patient.age_years || 'N/A'}.`;

        // Extract and format key findings/biomarkers
        const biomarkers = detailData.data.biomarkers;
        let extractedValues = [];

        if (Array.isArray(biomarkers)) {
          extractedValues = biomarkers.map(b => ({
            name: b.name,
            value: `${b.value} ${b.unit || ''}`.trim()
          }));
        } else if (typeof biomarkers === 'object' && biomarkers !== null) {
          extractedValues = Object.entries(biomarkers).map(([key, val]) => {
            let displayVal = val;
            if (typeof val === 'object' && val !== null && 'value' in val) {
              const v = val as { value: any; unit?: string };
              displayVal = `${v.value} ${v.unit || ''}`;
            }
            return {
              name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Title case
              value: String(displayVal).trim()
            };
          });
        }

        // Additional fallback: If no biomarkers found, keep original values or add a default
        if (extractedValues.length === 0) {
          extractedValues = [
            { name: "Status", value: "Processed" },
            { name: "Result", value: "Review Required" }
          ];
        }

        // Update state with details
        setReports((prev) =>
          prev.map((r) => {
            if (r.id !== id) return r;

            // Try to upgrade the name if it's generic/unknown
            let betterName = r.name;
            if ((r.name === "Unknown" || r.name === "Medical Report") && detailData.data.report?.type) {
              betterName = detailData.data.report.type;
            }

            // Determine status based on values
            let status = "Normal";

            const checkValue = (name: string, value: any): string | null => {
              const valNum = parseFloat(value);
              if (isNaN(valNum)) return null;

              const lowerName = name.toLowerCase();

              // Glucose Logic
              if (lowerName.includes("glucose") || lowerName.includes("fbs") || lowerName.includes("fasting")) {
                if (valNum >= 126) return "Alert";
                if (valNum >= 100) return "Watch";
                return "Normal";
              }

              // Lipid/Cholesterol Logic
              if (lowerName.includes("cholesterol") || lowerName.includes("total")) {
                if (valNum >= 240) return "Alert";
                if (valNum >= 200) return "Watch";
                return "Normal";
              }

              return null;
            };

            // Calculate overall status for this report
            if (betterName.toLowerCase().includes("blood count") || betterName.toLowerCase().includes("fbc") || betterName.toLowerCase().includes("cbc")) {
              status = ""; // No label for FBC
            } else {
              // Check all extracted values
              let worstStatus = "Normal";
              for (const item of extractedValues) {
                const itemStatus = checkValue(item.name, item.value);
                if (itemStatus === "Alert") {
                  worstStatus = "Alert";
                  break;
                }
                if (itemStatus === "Watch" && worstStatus !== "Alert") {
                  worstStatus = "Watch";
                }
              }
              status = worstStatus;
            }

            return {
              ...r,
              aiSummary,
              biomarkers: detailData.data.biomarkers,
              name: betterName,
              status,
              extractedValues // Store formatted values for display
            };
          })
        );
      }
    } catch (error) {
      console.error("Failed to load report details", error);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Normal":
        return "bg-success/10 text-success border-success/20";
      case "Watch":
        return "bg-warning/10 text-warning border-warning/20";
      case "Alert":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "":
        return "hidden"; // Hide label for FBC
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
        {reports.length > 0 ? (
          reports
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
                        {!report.aiSummary ? (
                          <div className="flex justify-center items-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            <span className="ml-2 text-sm text-muted-foreground">Loading details...</span>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {(report.extractedValues || report.values).map((val, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 rounded-xl bg-secondary/50"
                                >
                                  <p className="text-xs text-muted-foreground capitalize">
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
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
        ) : (
          !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No reports found</h3>
              <p className="text-muted-foreground mt-2">
                Upload your first medical report to see it here.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Reports;