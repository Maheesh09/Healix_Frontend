import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const JourneySection = () => {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Your Health Journey,{" "}
            <span className="text-healix-coral">Simplified</span>
          </h2>
          
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Healix is your lifelong digital health companion. We help you organize, understand and track your medical records with AI-powered insights. Take control of your health data today.
          </p>
          
          <div>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90 font-semibold px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Link to="/dashboard">Explore Healix</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
