import { Card, CardContent } from "@/components/ui/card";
import { Heart, Droplet, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const bodySystems = [
  {
    id: 1,
    name: "Heart",
    subtitle: "Cardiovascular System",
    icon: Heart,
    reports: 12,
    lastUpdated: "Dec 28, 2025",
    status: "Normal",
    color: "bg-warning/10",
    iconColor: "text-warning",
  },
  {
    id: 2,
    name: "Blood",
    subtitle: "Hematologic System",
    icon: Droplet,
    reports: 12,
    lastUpdated: "Dec 28, 2025",
    status: "Normal",
    color: "bg-destructive/10",
    iconColor: "text-destructive",
  },
];

const BodySystems = () => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-success/10 text-success border-success/20";
      case "Watch":
        return "bg-warning/10 text-warning border-warning/20";
      case "Alert":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Body Systems</h1>
        <p className="text-muted-foreground">View your health organized by body system</p>
      </div>

      {/* Body System Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bodySystems.map((system) => (
          <Card key={system.id} className="shadow-card border-0 hover:shadow-card-hover transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${system.color} flex items-center justify-center`}>
                  <system.icon className={`h-6 w-6 ${system.iconColor}`} />
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border ${getStatusStyle(system.status)}`}>
                  {system.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-1">{system.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{system.subtitle}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{system.reports} reports</span>
                  <span className="mx-2">•</span>
                  <span>Updated {system.lastUpdated}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BodySystems;
