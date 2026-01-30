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
        <img
          src="/logo.png"
          alt="Healix Logo"
          className={cn(sizeClasses[size], "w-auto object-contain transition-transform duration-300")}
        />

        {showText && (
          <span className={cn("font-bold transition-colors duration-300", textSizes[size])}>
            Healix
          </span>
        )}
      </div>
    );
  }
);

HealixLogo.displayName = "HealixLogo";

export default HealixLogo;