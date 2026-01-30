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
        
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="py-6 border-t border-sidebar-border">
        <nav className="space-y-1 px-3">
          {bottomItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Disclaimer */}
        <div className="mt-6 mx-3 p-3 rounded-xl bg-muted/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Healix provides informational insights and does not replace professional medical advice.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
