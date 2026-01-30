import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-healix-mint to-info p-12 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Take Control of Your Health Data
          </h2>
          
          <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
            Start your lifelong digital health profile today. Secure, private and always accessible.
          </p>
          
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white text-primary hover:bg-white/90 font-semibold px-8"
          >
            <Link to="/signup">Get Started Free</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
