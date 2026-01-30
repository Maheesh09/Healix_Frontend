import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

// Page transition wrapper - smooth fade and slide
export const PageTransition = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0.8, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Stagger container for lists/grids
export const StaggerContainer = ({ 
  children, 
  className,
  staggerDelay = 0.05 
}: { 
  children: ReactNode; 
  className?: string;
  staggerDelay?: number;
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Stagger item - use inside StaggerContainer
export const StaggerItem = ({ 
  children, 
  className,
  ...props 
}: HTMLMotionProps<"div"> & { children: ReactNode }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0.6, y: 12 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" }
      },
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Hover lift effect for cards
export const HoverCard = ({ 
  children, 
  className,
  ...props 
}: HTMLMotionProps<"div"> & { children: ReactNode }) => (
  <motion.div
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.98 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Hover scale effect for buttons/links
export const HoverScale = ({ 
  children, 
  className,
  scale = 1.02,
  ...props 
}: HTMLMotionProps<"div"> & { children: ReactNode; scale?: number }) => (
  <motion.div
    whileHover={{ scale, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.98 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Fade in from direction
export const FadeIn = ({ 
  children, 
  className,
  direction = "up",
  delay = 0,
  ...props 
}: HTMLMotionProps<"div"> & { 
  children: ReactNode; 
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}) => {
  const directionOffset = {
    up: { y: 16 },
    down: { y: -16 },
    left: { x: 16 },
    right: { x: -16 },
  };

  return (
    <motion.div
      initial={{ opacity: 0.7, ...directionOffset[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Float animation for decorative elements
export const Float = ({ 
  children, 
  className,
  duration = 4,
  ...props 
}: HTMLMotionProps<"div"> & { children: ReactNode; duration?: number }) => (
  <motion.div
    animate={{ 
      y: [0, -8, 0],
    }}
    transition={{ 
      duration,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Icon hover rotation
export const HoverRotate = ({ 
  children, 
  className,
  ...props 
}: HTMLMotionProps<"div"> & { children: ReactNode }) => (
  <motion.div
    whileHover={{ 
      rotate: 8, 
      scale: 1.1,
      transition: { duration: 0.2 } 
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);
