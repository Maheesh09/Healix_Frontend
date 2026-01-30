import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HealixLogo from "@/components/HealixLogo";
import { motion } from "framer-motion";

const LandingHeader = () => {
  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ opacity: 0.9, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container relative flex h-16 items-center justify-between">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link to="/">
            <HealixLogo size="md" />
          </Link>
        </motion.div>

        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {["Home", "Features", "About", "Contact"].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0.8, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                to={item === "Home" ? "/#home" : `/#${item.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
              >
                {item}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-3 z-10">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              asChild
              className="rounded-full border-primary text-primary hover:bg-primary/5 transition-colors duration-300"
            >
              <Link to="/login">Login</Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              asChild
              className="rounded-full bg-primary hover:bg-primary/90 transition-shadow duration-300 hover:shadow-lg"
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
