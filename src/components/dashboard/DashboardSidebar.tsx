import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  HeartPulse,
  FileText,
  TrendingUp,
  Pill,
  Upload,
  Users,
  User,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: HeartPulse, label: "Body Systems", href: "/body-systems" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: TrendingUp, label: "Trends", href: "/trends" },
  { icon: Pill, label: "Medications", href: "/medications" },
  { icon: Upload, label: "Upload", href: "/upload" },
  { icon: Users, label: "Care Circle", href: "/care-circle" },
];

const bottomItems = [
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0.7, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const }
  },
};

const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border">
      <div className="flex-1 py-6">
        <div className="px-4 mb-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            MENU
          </span>
        </div>

        <motion.nav
          className="space-y-1 px-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <motion.div key={item.href} variants={itemVariants}>
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={item.href}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden ${isActive
                        ? "bg-sidebar-accent text-sidebar-primary shadow-sm"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-sidebar-accent rounded-xl"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        style={{ zIndex: -1 }}
                      />
                    )}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: isActive ? 0 : 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <item.icon className={`h-5 w-5 ${isActive ? "scale-110" : "text-muted-foreground group-hover:text-foreground"}`} />
                    </motion.div>
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.nav>
      </div>

      {/* Bottom section */}
      <div className="py-6 border-t border-sidebar-border">
        <nav className="space-y-1 px-3">
          {bottomItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <motion.div
                key={item.href}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-300 ${isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? "scale-110" : ""}`} />
                  </motion.div>
                  {item.label}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Disclaimer */}
        <motion.div
          className="mt-6 mx-3 p-3 rounded-xl bg-muted/50"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <p className="text-xs text-muted-foreground leading-relaxed">
            Healix provides informational insights and does not replace professional medical advice.
          </p>
        </motion.div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
