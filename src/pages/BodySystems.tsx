import { Card, CardContent } from "@/components/ui/card";
import { Heart, Droplet, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/motion/MotionWrappers";

const bodySystems = [
  {
    id: 1,
    name: "Heart",
    subtitle: "Cardiovascular System",
    icon: Heart,
    reports: 12,
    lastUpdated: "Dec 28, 2025",
    status: "Normal",
    color: "bg-warning/10",
    iconColor: "text-warning",
  },
  {
    id: 2,
    name: "Blood",
    subtitle: "Hematologic System",
    icon: Droplet,
    reports: 12,
    lastUpdated: "Dec 28, 2025",
    status: "Normal",
    color: "bg-destructive/10",
    iconColor: "text-destructive",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0.7, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const }
  },
};

const BodySystems = () => {
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
    <PageTransition className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0.8, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Body Systems</h1>
        <p className="text-muted-foreground">View your health organized by body system</p>
      </motion.div>

      {/* Body System Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {bodySystems.map((system) => (
          <motion.div key={system.id} variants={itemVariants}>
            <motion.div
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <Card className="shadow-card border-0 hover:shadow-card-hover transition-shadow duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      className={`w-12 h-12 rounded-xl ${system.color} flex items-center justify-center`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <system.icon className={`h-6 w-6 ${system.iconColor}`} />
                    </motion.div>
                    <span className={`text-xs px-3 py-1 rounded-full border ${getStatusStyle(system.status)}`}>
                      {system.status}
                    </span>
                  </div>

                  <h3 className="text-lg lg:text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">{system.name}</h3>
                  <p className="text-xs lg:text-sm text-muted-foreground mb-4">{system.subtitle}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{system.reports} reports</span>
                      <span className="mx-2">•</span>
                      <span>Updated {system.lastUpdated}</span>
                    </div>
                    <motion.div
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary transition-colors duration-300"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-300" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </PageTransition>
  );
};

export default BodySystems;
