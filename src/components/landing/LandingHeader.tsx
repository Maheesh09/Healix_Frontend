import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HealixLogo from "@/components/HealixLogo";

const LandingHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="transition-transform hover:scale-105">
            <HealixLogo size="md" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {["Home", "Features", "About", "Contact"].map((item, index) => (
              <Link 
                key={item}
                to={item === "Home" ? "/" : `/#${item.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            asChild 
            className="rounded-full border-primary text-primary hover:bg-primary/5 transition-all duration-300 hover:scale-105"
          >
            <Link to="/login">Login</Link>
          </Button>
          <Button 
            asChild 
            className="rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
