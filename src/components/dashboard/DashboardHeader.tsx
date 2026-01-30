import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HealixLogo from "@/components/HealixLogo";
import { Bell, LogOut, Upload } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Reports", href: "/reports" },
  { label: "Trends", href: "/trends" },
  { label: "Medications", href: "/medications" },
];

const DashboardHeader = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/dashboard">
            <HealixLogo size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild className="rounded-full bg-primary hover:bg-primary/90">
            <Link to="/upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="rounded-full border-primary text-primary hover:bg-primary/5">
            <Link to="/login">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Link>
          </Button>

          {/* Notification bell */}
          <button className="relative p-2 hover:bg-muted rounded-full transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </button>

          {/* User avatar */}
          <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">M</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
