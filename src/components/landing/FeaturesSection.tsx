import { FileText, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "Complete Health Records",
    description: "All your medical reports organized in one secure place for lifetime access.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Activity,
    title: "Body System Insights",
    description: "View health data organized by body systems for better understanding.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: TrendingUp,
    title: "Health Trend Analysis",
    description: "Track your biomarkers over time with interactive visual charts.",
    color: "bg-primary/10 text-primary",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 animate-fade-in">
            Say Goodbye to{" "}
            <span className="text-healix-coral">Report Chaos</span>
          </h2>
          <p className="text-muted-foreground text-lg animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Transform the way you manage your health records
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-500 bg-card group cursor-pointer animate-fade-in-up hover:-translate-y-2"
              style={{ animationDelay: `${0.2 + index * 0.15}s` }}
            >
              <CardContent className="p-6">
                <div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
