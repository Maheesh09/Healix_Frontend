import { FileText, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: FileText,
    title: "Complete Health Records",
    description: "All your medical reports organized in one secure place for lifetime access.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Activity,
    title: "Body System Insights",
    description: "View health data organized by body systems for better understanding.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: TrendingUp,
    title: "Health Trend Analysis",
    description: "Track your biomarkers over time with interactive visual charts.",
    color: "bg-primary/10 text-primary",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0.7, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }
  },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0.8, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Say Goodbye to{" "}
            <span className="text-healix-coral">Report Chaos</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0.8, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Transform the way you manage your health records
          </motion.p>
        </div>

        {/* Feature cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <Card className="border border-border/50 shadow-card hover:shadow-card-hover transition-shadow duration-300 bg-card group cursor-pointer h-full">
                  <CardContent className="p-6">
                    <motion.div
                      className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <feature.icon className="h-6 w-6" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
