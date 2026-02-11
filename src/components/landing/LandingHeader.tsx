import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HealixLogo from "@/components/HealixLogo";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const LandingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-gray-200/20"
        : "bg-black/30 backdrop-blur-md border-b border-white/10"
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container relative flex h-20 items-center justify-between">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/"
            className={`transition-colors duration-300 ${isScrolled
                ? "text-foreground"
                : "text-white"
              }`}
          >
            <HealixLogo size="md" />
          </Link>
        </motion.div>

        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {["Home", "Features", "About", "Contact"].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
            >
              <Link
                to={item === "Home" ? "/#home" : `/#${item.toLowerCase()}`}
                className={`text-sm font-medium transition-colors duration-300 relative group ${isScrolled
                  ? "text-foreground hover:text-primary"
                  : "text-white hover:text-primary"
                  }`}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              asChild
              className={`rounded-full font-medium transition-all duration-300 ${isScrolled
                ? "text-foreground hover:text-primary hover:bg-primary/10"
                : "text-white hover:text-primary hover:bg-white/10"
                }`}
            >
              <Link to="/login">Login</Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300 px-6"
            >
              <Link to="/signup">Sign Up</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default LandingHeader;

