import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-24 bg-background relative z-10">
      <div className="container">
        <motion.div
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-healix-mint to-info p-8 sm:p-12 lg:p-16 text-center shadow-2xl"
          initial={{ opacity: 0.9, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />

          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-80 h-80 bg-healix-teal-dark/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />

          {/* Floating Glass Icon */}
          <motion.div
            className="relative mx-auto w-20 h-20 glass-card rounded-2xl flex items-center justify-center mb-8 shadow-lg border-white/30"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Shield className="h-10 w-10 text-white" />
          </motion.div>

          <h2 className="relative text-3xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            Take Control of Your <br className="hidden sm:block" />
            Health Data Today
          </h2>

          <p className="relative text-blue-50 text-xl mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Join thousands of users who have already simplified their health journey.
            Secure, private, and smart.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block relative z-10"
          >
            <Button
              asChild
              size="lg"
              className="h-16 px-10 rounded-full bg-white text-primary hover:bg-white/90 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <Link to="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>

          {/* Decorative bottom text */}
          <p className="relative mt-8 text-white/60 text-sm font-medium">
            No credit card required · Free plan forever
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;

