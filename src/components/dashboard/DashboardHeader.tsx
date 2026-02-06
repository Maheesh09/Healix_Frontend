import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HealixLogo from "@/components/HealixLogo";
import {
  Bell,
  LogOut,
  Upload,
  Menu,
  LayoutDashboard,
  HeartPulse,
  FileText,
  TrendingUp,
  Pill,
  Users,
  User,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Menu items copied from DashboardSidebar to ensure consistency
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

const DashboardHeader = () => {
  const location = useLocation();

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ opacity: 0.9, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Mobile Menu Trigger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[280px] sm:w-[300px] p-0 bg-sidebar border-r border-sidebar-border"
              >
                <SheetHeader className="p-6 pb-2 text-left">
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      <HealixLogo size="md" />
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-[calc(100vh-5rem)]">
                  <div className="flex-1 py-4 px-4 overflow-y-auto">
                    <div className="px-2 mb-4">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        MENU
                      </span>
                    </div>
                    <nav className="space-y-1">
                      {menuItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-300 ${
                              isActive
                                ? "bg-sidebar-accent text-sidebar-primary"
                                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                            }`}
                          >
                            <item.icon
                              className={`h-5 w-5 ${isActive ? "scale-110" : ""}`}
                            />
                            {item.label}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>

                  <div className="p-4 border-t border-sidebar-border">
                    <nav className="space-y-1 mb-4">
                      {bottomItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-300 ${
                              isActive
                                ? "bg-sidebar-accent text-sidebar-primary"
                                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                            }`}
                          >
                            <item.icon
                              className={`h-5 w-5 ${isActive ? "scale-110" : ""}`}
                            />
                            {item.label}
                          </Link>
                        );
                      })}
                      <Link
                        to="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors duration-300"
                      >
                        <LogOut className="h-5 w-5" />
                        Logout
                      </Link>
                    </nav>

                    <div className="p-3 rounded-xl bg-muted/50">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Healix provides informational insights and does not
                        replace professional medical advice.
                      </p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/dashboard">
              <HealixLogo size="md" className="hidden sm:flex" />
              <HealixLogo
                size="sm"
                className="flex sm:hidden"
                showText={false}
              />
            </Link>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              asChild
              className="rounded-full bg-primary hover:bg-primary/90 transition-shadow duration-300 hover:shadow-lg h-9 sm:h-10 px-3 sm:px-4"
            >
              <Link to="/upload">
                <Upload className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Upload</span>
              </Link>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="hidden sm:block"
          >
            <Button
              variant="outline"
              asChild
              className="rounded-full border-primary text-primary hover:bg-primary/5 transition-colors duration-300"
            >
              <Link to="/">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Link>
            </Button>
          </motion.div>

          {/* Notification bell */}
          <motion.button
            className="relative p-2 hover:bg-muted rounded-full transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </motion.button>

          {/* User avatar */}
          <Link to="/profile">
            <motion.div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xs sm:text-sm font-semibold text-primary">
                S
              </span>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
