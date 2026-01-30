import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface HealixLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const HealixLogo = forwardRef<HTMLDivElement, HealixLogoProps>(
  ({ className, size = "md", showText = true }, ref) => {
    const sizeClasses = {
      sm: "h-6",
      md: "h-8",
      lg: "h-10",
    };

    const textSizes = {
      sm: "text-lg",
      md: "text-xl",
      lg: "text-2xl",
    };

    return (
      <div 
        ref={ref}
        className={cn(
          "flex items-center gap-2 transition-all duration-300 hover:scale-[1.02]", 
          className
        )}
      >
        {/* DNA Helix Icon */}
        <svg
          className={cn(sizeClasses[size], "w-auto transition-transform duration-300")}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* DNA Strand 1 */}
          <path
            d="M12 4C12 4 28 12 28 20C28 28 12 36 12 36"
            stroke="url(#gradient1)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* DNA Strand 2 */}
          <path
            d="M28 4C28 4 12 12 12 20C12 28 28 36 28 36"
            stroke="url(#gradient2)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Cross links */}
          <line x1="14" y1="12" x2="26" y2="12" stroke="hsl(168 76% 42%)" strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="20" x2="26" y2="20" stroke="hsl(168 76% 42%)" strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="28" x2="26" y2="28" stroke="hsl(168 76% 42%)" strokeWidth="2" strokeLinecap="round" />
          
          <defs>
            <linearGradient id="gradient1" x1="12" y1="4" x2="28" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="hsl(168 76% 42%)" />
              <stop offset="1" stopColor="hsl(199 89% 48%)" />
            </linearGradient>
            <linearGradient id="gradient2" x1="28" y1="4" x2="12" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="hsl(199 89% 48%)" />
              <stop offset="1" stopColor="hsl(168 76% 42%)" />
            </linearGradient>
          </defs>
        </svg>
        
        {showText && (
          <span className={cn("font-bold text-foreground transition-colors duration-300", textSizes[size])}>
            Healix
          </span>
        )}
      </div>
    );
  }
);

HealixLogo.displayName = "HealixLogo";

export default HealixLogo;