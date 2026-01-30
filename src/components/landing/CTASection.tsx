import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-healix-mint to-info p-12 text-center">
          {/* Animated background elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse-soft" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg animate-float" />
          
          {/* Icon */}
          <div className="relative mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 animate-bounce-gentle">
            <Shield className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="relative text-2xl lg:text-3xl font-bold text-white mb-4">
            Take Control of Your Health Data
          </h2>
          
          <p className="relative text-white/80 text-lg mb-8 max-w-lg mx-auto">
            Start your lifelong digital health profile today. Secure, private and always accessible.
          </p>
          
          <Button
            asChild
            size="lg"
            className="relative rounded-full bg-white text-primary hover:bg-white/90 font-semibold px-8 transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <Link to="/signup">Get Started Free</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
