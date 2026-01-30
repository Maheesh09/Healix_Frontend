import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const JourneySection = () => {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0.8, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Your Health Journey,{" "}
            <span className="text-healix-coral">Simplified</span>
          </motion.h2>
          
          <motion.p 
            className="text-muted-foreground text-lg mb-8 leading-relaxed"
            initial={{ opacity: 0.8, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Healix is your lifelong digital health companion. We help you organize, understand and track your medical records with AI-powered insights. Take control of your health data today.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0.8, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary hover:bg-primary/90 font-semibold px-8 transition-shadow duration-300 hover:shadow-lg"
              >
                <Link to="/dashboard">Explore Healix</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
