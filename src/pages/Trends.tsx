import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lightbulb, TrendingDown, AlertCircle, TrendingUp, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { predictNextValue } from "@/lib/utils";
import { format, subDays, subMonths, subYears } from "date-fns";
import {
  getCurrentUserId,
  getBiomarkerNames,
  getBiomarkerTrends,
  type BiomarkerTrend,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const timeRanges = ["Days", "Months", "Years"];

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const insights = [
  {
    icon: AlertCircle,
    title: "Health Insight",
    description:
      "Monitor your trends regularly to detect changes early.",
    date: new Date().toISOString().split("T")[0],
    color: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-500",
  },
];

const Trends = () => {
  const { toast } = useToast();
  const [activeBiomarker, setActiveBiomarker] = useState<string>("");
  const [biomarkerList, setBiomarkerList] = useState<string[]>([]);
  const [activeTimeRange, setActiveTimeRange] = useState("Months");
  const [trendData, setTrendData] = useState<BiomarkerTrend | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingNames, setLoadingNames] = useState(false);

  // Fetch biomarker names on mount
  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) {
       toast({ title: "Error", description: "User not logged in", variant: "destructive" });
       return;
    }
    setLoadingNames(true);
    getBiomarkerNames(userId)
      .then((names) => {
        setBiomarkerList(names);
        if (names.length > 0) {
          setActiveBiomarker(names[0]);
        }
      })
      .catch((err) => {
        console.error(err);
        toast({ title: "Failed to load biomarkers", description: err.message, variant: "destructive" });
      })
      .finally(() => setLoadingNames(false));
  }, []);

  // Fetch trend data when activeBiomarker changes
  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId || !activeBiomarker) return;

    setLoading(true);
    getBiomarkerTrends(userId, activeBiomarker)
      .then((data) => {
        setTrendData(data);
      })
      .catch((err) => {
        console.error(err);
        toast({ title: "Failed to load trend data", description: err.message, variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [activeBiomarker]);

  // Filter data based on time range
  const filteredData = trendData?.data_points.filter((item) => {
    const itemDate = new Date(item.date);
    const now = new Date();
    if (activeTimeRange === "Days") {
      return itemDate >= subDays(now, 30);
    } else if (activeTimeRange === "Months") {
      return itemDate >= subMonths(now, 12);
    } else {
      return itemDate >= subYears(now, 5);
    }
  }) || [];

  // Prediction
  const prediction = filteredData.length >= 3 ? predictNextValue(filteredData.map(d => d.value)) : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Trends</h1>
          <p className="text-muted-foreground mt-1">
            Track your biomarkers over time.
          </p>
        </div>
        
        {/* Mobile View: Select for biomarkers */}
        <div className="sm:hidden w-full">
           <Select value={activeBiomarker} onValueChange={setActiveBiomarker}>
            <SelectTrigger>
              <SelectValue placeholder="Select Biomarker" />
            </SelectTrigger>
            <SelectContent>
              {biomarkerList.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar for Desktop */}
         <Card className="hidden lg:block lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Biomarkers</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            {loadingNames ? (
              <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="flex flex-col space-y-1">
                {biomarkerList.length === 0 && <p className="text-sm text-muted-foreground p-2">No biomarkers found.</p>}
                {biomarkerList.map((name) => (
                    <button
                    key={name}
                    onClick={() => setActiveBiomarker(name)}
                    className={`text-left px-4 py-2 rounded-md text-sm transition-colors ${
                        activeBiomarker === name
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                    >
                    {name}
                    </button>
                ))}
                </div>
            )}
          </CardContent>
        </Card>

        {/* Main Chart Area */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                {activeBiomarker || "Select a biomarker"}
              </CardTitle>
               <div className="flex items-center space-x-2">
                  {timeRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => setActiveTimeRange(range)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activeTimeRange === range
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
               </div>
            </CardHeader>
            <CardContent className="p-6">
               {loading ? (
                 <div className="h-[300px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
               ) : !trendData || filteredData.length === 0 ? (
                 <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No data available for this time range.
                 </div>
               ) : (
                  <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={filteredData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                          dataKey="date"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => {
                             const d = new Date(value);
                             if (activeTimeRange === 'Days') return format(d, 'MMM d');
                             return format(d, 'MMM yyyy');
                          }}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                          domain={['auto', 'auto']}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                          labelStyle={{ color: "#374151", marginBottom: "0.25rem" }}
                          labelFormatter={(label) => format(new Date(label), "MMM d, yyyy")}
                        />
                        {trendData.ref_min !== null && (
                            <ReferenceLine y={trendData.ref_min} stroke="red" strokeDasharray="3 3" label={{ position: 'right', value: 'Min', fill: 'red', fontSize: 10 }} />
                        )}
                        {trendData.ref_max !== null && (
                            <ReferenceLine y={trendData.ref_max} stroke="red" strokeDasharray="3 3" label={{ position: 'right', value: 'Max', fill: 'red', fontSize: 10 }} />
                        )}
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ r: 4, strokeWidth: 2 }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                          animationDuration={1000}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
               )}
            </CardContent>
          </Card>

          {/* Analysis / Prediction */}
          {prediction && !loading && filteredData.length >= 3 && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/50">
                  <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                    <Lightbulb className="w-5 h-5 text-indigo-500" />
                    <CardTitle className="text-md font-medium text-indigo-700 dark:text-indigo-300">
                        AI Prediction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-indigo-600/80 dark:text-indigo-300/80 mb-2">
                        Based on your recent trends, your next predicted value is:
                    </p>
                    <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                        {prediction.toFixed(1)} {trendData?.unit}
                    </div>
                  </CardContent>
                </Card>
             </div>
          )}
          
          {/* Insights List */}
          <div className="space-y-4">
             <h3 className="text-lg font-semibold">Recent Insights</h3>
             {insights.map((insight, index) => (
                <div
                    key={index}
                    className={`flex gap-4 p-4 rounded-xl border ${insight.color} transition-all hover:shadow-md`}
                >
                    <div className={`p-2 rounded-full bg-white dark:bg-black/20 h-fit`}>
                    <insight.icon className={`w-5 h-5 ${insight.iconColor}`} />
                    </div>
                    <div>
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                        {insight.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        {insight.date}
                    </p>
                    </div>
                </div>
                ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Trends;
