import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ddImage from "@/assets/dd.jpg";

const HeroSection = () => {

  return (
    <section id="home" className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${ddImage})` }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="max-w-3xl">
          {/* Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white mb-6">
              Smart & Secure <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-healix-mint">
                Health Profile
              </span>
            </h1>

            <motion.p
              className="text-xl text-white/90 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Understand, track, and organize your complete medical history in one secure digital profile.
              Your health data, reimagined for the modern age.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary hover:bg-primary/90 text-white font-semibold px-8 h-14 text-lg shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-1"
              >
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 h-14 text-lg transition-all duration-300 backdrop-blur-sm"
              >
                <Link to="/explore">
                  How it works
                </Link>
              </Button>
            </motion.div>


          </motion.div>
        </div>
      </div>



      {/* Modern curved bottom */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden z-10">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full text-background fill-current">
          <path d="M0 100V50C240 0 480 80 720 80C960 80 1200 0 1440 50V100H0Z" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;

