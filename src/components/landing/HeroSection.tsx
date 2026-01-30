import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroIllustration from "@/assets/hero-illustration.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Animated decorative circles */}
      <motion.div
        className="absolute top-20 right-1/4 w-3 h-3 bg-white/30 rounded-full"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 right-1/3 w-2 h-2 bg-white/20 rounded-full"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="absolute top-40 right-20 w-4 h-4 bg-white/20 rounded-full"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-60 left-20 w-3 h-3 bg-white/15 rounded-full"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      <motion.div
        className="absolute bottom-48 left-1/4 w-2 h-2 bg-white/25 rounded-full"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="container relative z-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-white space-y-6">
            <motion.h1
              className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white"
              initial={{ opacity: 0.8, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Smart and<br />
              Secure Health<br />
              <span className="text-white/90">PROFILE</span>
            </motion.h1>

            <motion.p
              className="text-lg text-white/80 max-w-md leading-relaxed"
              initial={{ opacity: 0.8, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            >
              Understand, track and organize your complete medical history in one secure digital profile. Access your health data anytime, anywhere.
            </motion.p>

            <motion.div
              initial={{ opacity: 0.8, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-white text-primary hover:bg-white/90 font-semibold px-8 transition-shadow duration-300 hover:shadow-xl"
                >
                  <Link to="/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right content - Doctor illustration */}
          <motion.div
            className="hidden lg:flex relative justify-center lg:justify-end"
            initial={{ opacity: 0.8, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              className="relative"
              animate={{
                y: [0, -12, 0],
                rotate: [0, 1, -1, 0]
              }}
              transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <img
                src={heroIllustration}
                alt="Healthcare professional"
                className="h-[400px] lg:h-[500px] w-auto object-contain drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
