import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  AlertTriangle,
  Calendar,
  Bell,
  Activity,
  Droplet
} from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/motion/MotionWrappers";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/services/api";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0.7, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }
  },
};

const Dashboard = () => {
  const { patient } = useAuth();
  const [fbsData, setFbsData] = useState<{ value: string; unit: string; date: string } | null>(null);
  const [cholesterolData, setCholesterolData] = useState<{ value: string; unit: string; date: string } | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [stats, setStats] = useState({
    totalReports: 0,
    lastUpload: "None",
    activeConditions: "0", // Static for now
    healthAlerts: "0"      // Static for now
  });

  useEffect(() => {
    const fetchHealthMetrics = async () => {
      // Strictly use the patient from context to ensure user-scoped data
      const nic = patient?.nic;

      if (!nic) {
        setLoadingMetrics(false);
        setStats({
          totalReports: 0,
          lastUpload: "None",
          activeConditions: "0",
          healthAlerts: "0"
        });
        setFbsData(null);
        setCholesterolData(null);
        return;
      }

      setLoadingMetrics(true); // Reset loading state when fetching for a new user

      try {
        // 1. Fetch all reports to find relevant ones
        const res = await fetch(`${API_BASE_URL}/ocr/reports/nic/${nic}?source=database`);
        if (!res.ok) throw new Error("Failed to fetch reports");
        const listData = await res.json();

        // Sort reports by date (newest first)
        const sortedReports = listData.reports.sort((a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        // Helper check function (reused from Reports.tsx)
        const checkStatus = (name: string, value: any): "Alert" | "Watch" | "Normal" | null => {
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

        // Fetch details for ALL reports to calculate stats
        let watchCount = 0;
        let alertCount = 0;

        const reportDetailsPromises = sortedReports.map(async (report: any) => {
          try {
            const detailRes = await fetch(`${API_BASE_URL}/ocr/report/${nic}/${report.file_id}/normalized`);
            if (!detailRes.ok) return null;
            const detailData = await detailRes.json();
            const biomarkers = detailData.data.biomarkers;

            let worstStatus = "Normal";
            let items: any[] = [];

            if (Array.isArray(biomarkers)) items = biomarkers;
            else if (typeof biomarkers === 'object' && biomarkers) {
              items = Object.entries(biomarkers).map(([k, v]) => ({ name: k, value: (v as any)?.value || v }));
            }

            // Check extracted values
            for (const item of items) {
              const s = checkStatus(item.name, item.value);
              if (s === "Alert") { worstStatus = "Alert"; break; }
              if (s === "Watch" && worstStatus !== "Alert") worstStatus = "Watch";
            }

            // Exclude FBC from status logic (as per Reports.tsx)
            const reportType = (detailData.data.report?.type || report.report_type || "").toLowerCase();
            if (reportType.includes("blood count") || reportType.includes("fbc") || reportType.includes("cbc")) {
              return "Normal";
            }

            return worstStatus;
          } catch (e) {
            return "Normal";
          }
        });

        const statuses = await Promise.all(reportDetailsPromises);
        statuses.forEach(s => {
          if (s === "Watch") watchCount++;
          if (s === "Alert") alertCount++;
        });

        // Update Stats
        setStats(prev => ({
          ...prev,
          totalReports: sortedReports.length,
          lastUpload: sortedReports.length > 0
            ? new Date(sortedReports[0].created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : "None",
          activeConditions: watchCount.toString(),
          healthAlerts: alertCount.toString()
        }));

        // Find latest potential reports for cards
        const fbsReport = sortedReports.find((r: any) =>
          r.report_type?.toLowerCase().includes("glucose") ||
          r.report_type?.toLowerCase().includes("fbs") ||
          r.report_type?.toLowerCase().includes("sugar")
        );

        const lipidReport = sortedReports.find((r: any) =>
          r.report_type?.toLowerCase().includes("lipid") ||
          r.report_type?.toLowerCase().includes("cholesterol")
        );

        // Helper to fetch details and extract value for specific cards
        const fetchDetails = async (report: any, keys: string[]) => {
          if (!report) return null;
          try {
            const detailRes = await fetch(`${API_BASE_URL}/ocr/report/${nic}/${report.file_id}/normalized`);
            if (!detailRes.ok) return null;
            const detailData = await detailRes.json();
            const markers = detailData.data.biomarkers;

            // Check if markers is object or array and find value
            let found = null;
            if (Array.isArray(markers)) {
              found = markers.find((m: any) => keys.some(k => m.name.toLowerCase().includes(k)));
              if (found) return { value: found.value, unit: found.unit || '' };
            } else if (typeof markers === 'object' && markers !== null) {
              for (const key of Object.keys(markers)) {
                if (keys.some(k => key.toLowerCase().includes(k))) {
                  // Value might be string, number or object
                  const val = markers[key];
                  if (typeof val === 'object' && val.value) return { value: val.value, unit: val.unit || '' };
                  return { value: val, unit: '' };
                }
              }
            }
            return null;
          } catch (e) {
            console.error("Error fetching details", e);
            return null;
          }
        };

        // Parallel fetch for cards
        const [fbs, lipid] = await Promise.all([
          fetchDetails(fbsReport, ["fasting plasma glucose", "glucose", "fbs"]),
          fetchDetails(lipidReport, ["total cholesterol", "cholesterol"])
        ]);

        if (fbs) setFbsData({ ...fbs, date: new Date(fbsReport.created_at).toLocaleDateString() });
        else setFbsData(null); // Clear if not found

        if (lipid) setCholesterolData({ ...lipid, date: new Date(lipidReport.created_at).toLocaleDateString() });
        else setCholesterolData(null); // Clear if not found

      } catch (err) {
        console.error("Error loading health metrics", err);
        // Reset on error
        setFbsData(null);
        setCholesterolData(null);
      } finally {
        setLoadingMetrics(false);
      }
    };

    fetchHealthMetrics();
  }, [patient]);

  // Summary cards data with dynamic values
  const summaryCards = [
    {
      icon: FileText,
      label: "Total Reports",
      value: stats.totalReports.toString(),
      color: "bg-primary/10 text-primary"
    },
    {
      icon: AlertTriangle,
      label: "Active Conditions",
      value: stats.activeConditions,
      color: "bg-warning/10 text-warning"
    },
    {
      icon: Calendar,
      label: "Last Upload",
      value: stats.lastUpload,
      color: "bg-info/10 text-info"
    },
    {
      icon: Bell,
      label: "Health Alerts",
      value: stats.healthAlerts,
      color: "bg-destructive/10 text-destructive"
    },
  ];

  // Determine greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const getStatus = (type: 'glucose' | 'cholesterol', valueStr: string) => {
    const value = parseFloat(valueStr);
    if (isNaN(value)) return null;

    if (type === 'glucose') {
      if (value >= 126) return { label: 'Alert', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' };
      if (value >= 100) return { label: 'Watch', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' };
      return { label: 'Normal', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' };
    }
    if (type === 'cholesterol') {
      if (value >= 240) return { label: 'Alert', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' };
      if (value >= 200) return { label: 'Watch', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' };
      return { label: 'Normal', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' };
    }
    return null;
  };

  return (
    <PageTransition className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground p-6 sm:p-8 shadow-lg mx-4 sm:mx-6 lg:mx-8 mt-6">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 opacity-10">
          <Activity className="w-48 h-48" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
            <div>
              <p className="text-primary-foreground/80 font-medium mb-1 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                {greeting}, {patient?.full_name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="mt-2 text-primary-foreground/90 max-w-xl text-base leading-relaxed">
                Here's your daily health overview. You have {stats.healthAlerts} active alerts.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {summaryCards.map((card, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm group overflow-hidden relative">
                <div className={`absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity ${card.color.replace('bg-', 'text-')}`}>
                  <card.icon className="w-16 h-16 -mr-4 -mt-4" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl ${card.color} transition-transform group-hover:scale-110 duration-300 shadow-sm`}>
                      <card.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{card.label}</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground mt-0.5">{card.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Biomarkers Section */}
      <div className="px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight">Recent Vitals</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Glucose Card */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group"
          >
            <div className="h-full rounded-2xl bg-white dark:bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
              <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500" />
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                      <Droplet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold">Glucose</h3>
                      <p className="text-[10px] text-muted-foreground">Fasting Plasma</p>
                    </div>
                  </div>
                  {fbsData && (() => {
                    const status = getStatus('glucose', fbsData.value);
                    return status ? (
                      <span className={`px-2.5 py-0.5 ${status.color} text-[10px] font-bold rounded-full uppercase`}>
                        {status.label}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-full uppercase">
                        Latest
                      </span>
                    );
                  })()}
                </div>

                {loadingMetrics ? (
                  <div className="py-6 flex justify-center"><div className="animate-pulse w-6 h-6 rounded-full bg-muted"></div></div>
                ) : fbsData ? (
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-black text-foreground tracking-tight">{fbsData.value}</span>
                      <span className="text-sm font-medium text-muted-foreground">{fbsData.unit}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg w-fit">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{fbsData.date}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center bg-muted/10 rounded-xl border border-dashed border-border">
                    <p className="text-xs text-muted-foreground">No glucose data recorded</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Cholesterol Card */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="group"
          >
            <div className="h-full rounded-2xl bg-white dark:bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
              <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-red-500" />
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold">Cholesterol</h3>
                      <p className="text-[10px] text-muted-foreground">Total Lipid Profile</p>
                    </div>
                  </div>
                  {cholesterolData && (() => {
                    const status = getStatus('cholesterol', cholesterolData.value);
                    return status ? (
                      <span className={`px-2.5 py-0.5 ${status.color} text-[10px] font-bold rounded-full uppercase`}>
                        {status.label}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-[10px] font-bold rounded-full uppercase">
                        Latest
                      </span>
                    );
                  })()}
                </div>

                {loadingMetrics ? (
                  <div className="py-6 flex justify-center"><div className="animate-pulse w-6 h-6 rounded-full bg-muted"></div></div>
                ) : cholesterolData ? (
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-black text-foreground tracking-tight">{cholesterolData.value}</span>
                      <span className="text-sm font-medium text-muted-foreground">{cholesterolData.unit}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg w-fit">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{cholesterolData.date}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center bg-muted/10 rounded-xl border border-dashed border-border">
                    <p className="text-xs text-muted-foreground">No lipid data recorded</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
