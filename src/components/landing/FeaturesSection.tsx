import { FileText, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: FileText,
    title: "Complete Health Records",
    description: "All your medical reports organized in one secure place for lifetime access.",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    delay: 0,
  },
  {
    icon: Activity,
    title: "Body System Insights",
    description: "View health data organized by body systems for better understanding.",
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    delay: 0.1,
  },
  {
    icon: TrendingUp,
    title: "Health Trend Analysis",
    description: "Track your biomarkers over time with interactive visual charts.",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    delay: 0.2,
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-healix-mint/10 rounded-full blur-3xl translate-x-1/3 pointer-events-none" />

      <div className="container relative z-10">
        <div className="text-center mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">Features</span>
            <h2 className="text-3xl lg:text-5xl font-bold mt-2 mb-6">
              More Than Just <span className="text-gradient">Storage</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Healix transforms your medical history into an intelligent, interactive health profile that works for you.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
            >
              <div className="h-full group">
                <Card className="glass-card border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500" />

                  <CardContent className="p-8">
                    <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-7 w-7" />
                    </div>

                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

