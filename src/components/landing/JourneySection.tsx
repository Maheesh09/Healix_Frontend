import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Upload, FileSearch, LineChart, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Records",
    description: "Simply snap a photo or upload your PDF medical reports.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: FileSearch,
    title: "AI Processing",
    description: "Our advanced AI extracts and organizes every detail securely.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: LineChart,
    title: "Track & Monitor",
    description: "Visualize your health trends and get personalized insights.",
    color: "bg-green-100 text-green-600",
  },
];

const JourneySection = () => {
  return (
    <section id="about" className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Your Health Journey, <br />
              <span className="text-gradient">Simplified</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Healix is more than just storage. It's your lifelong digital health companion that helps you understand your body better.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <p className="text-muted-foreground">Stop searching through piles of paper documents.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <p className="text-muted-foreground">Never miss a critical health trend or change.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <p className="text-muted-foreground">Share records easily with new doctors.</p>
              </div>
            </div>

            <motion.div
              className="mt-10"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary hover:bg-primary/90 font-semibold px-8 h-12 shadow-lg hover:shadow-primary/30 transition-all duration-300"
              >
                <Link to="/signup">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Visual Steps */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20 hidden md:block" />

            <div className="space-y-12 relative">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex gap-6 relative"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className={`w-16 h-16 rounded-2xl ${step.color} flex-shrink-0 flex items-center justify-center shadow-lg z-10 relative bg-white dark:bg-card border border-border/50`}>
                    <step.icon className="h-8 w-8" />
                    <div className="absolute -inset-1 rounded-2xl bg-inherit opacity-20 blur-lg -z-10" />
                  </div>

                  <div className="pt-2">
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default JourneySection;

