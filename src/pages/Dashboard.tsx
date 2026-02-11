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

        // Update Stats
        setStats(prev => ({
          ...prev,
          totalReports: sortedReports.length,
          lastUpload: sortedReports.length > 0
            ? new Date(sortedReports[0].created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : "None"
        }));

        // Find latest potential reports
        const fbsReport = sortedReports.find((r: any) =>
          r.report_type?.toLowerCase().includes("glucose") ||
          r.report_type?.toLowerCase().includes("fbs") ||
          r.report_type?.toLowerCase().includes("sugar")
        );

        const lipidReport = sortedReports.find((r: any) =>
          r.report_type?.toLowerCase().includes("lipid") ||
          r.report_type?.toLowerCase().includes("cholesterol")
        );

        // Helper to fetch details and extract value
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

        // Parallel fetch
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

  return (
    <PageTransition className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Welcome message */}
      <motion.div
        initial={{ opacity: 0.8, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Welcome back, {patient?.full_name || 'there'}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your health profile
        </p>
      </motion.div>

      {/* Summary cards */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {summaryCards.map((card, index) => (
          <motion.div key={index} variants={itemVariants}>
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="shadow-card border-0 cursor-pointer hover:shadow-card-hover transition-shadow duration-300 group">
                <CardContent className="p-4">
                  <motion.div
                    className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <card.icon className="h-5 w-5" />
                  </motion.div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="text-xl font-bold text-foreground">{card.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0.8, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-3"
        >
          <div className="flex items-center justify-between mb-4">
            {/* Removed "Health Insights" text as requested */}
            <div className="h-1"></div>
          </div>

          <motion.div
            className="grid md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Fasting Plasma Glucose Card */}
            <motion.div variants={itemVariants} className="h-full">
              <Card className="h-full shadow-card border-0 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Droplet className="w-24 h-24 text-primary" />
                </div>
                <CardContent className="p-6 flex flex-col justify-between h-full z-10 relative">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <Droplet className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold">Fasting Plasma Glucose</h3>
                    </div>

                    {loadingMetrics ? (
                      <div className="flex justify-center items-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : fbsData ? (
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-foreground">{fbsData.value}</span>
                          <span className="text-lg text-muted-foreground">{fbsData.unit}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Latest reading from {fbsData.date}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground py-4">No recent glucose data found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Total Cholesterol Card */}
            <motion.div variants={itemVariants} className="h-full">
              <Card className="h-full shadow-card border-0 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Activity className="w-24 h-24 text-warning" />
                </div>
                <CardContent className="p-6 flex flex-col justify-between h-full z-10 relative">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-warning/10 text-warning">
                        <Activity className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold">Total Cholesterol</h3>
                    </div>

                    {loadingMetrics ? (
                      <div className="flex justify-center items-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warning"></div>
                      </div>
                    ) : cholesterolData ? (
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-foreground">{cholesterolData.value}</span>
                          <span className="text-lg text-muted-foreground">{cholesterolData.unit}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Latest reading from {cholesterolData.date}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground py-4">No recent lipid data found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </motion.div>
        </motion.div>
      </div>

    </PageTransition>
  );
};

export default Dashboard;
