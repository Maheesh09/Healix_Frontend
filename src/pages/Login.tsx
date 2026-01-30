import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import HealixLogo from "@/components/HealixLogo";
import { Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to dashboard for demo
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center animate-fade-in-down">
          <Link to="/" className="transition-transform hover:scale-105">
            <HealixLogo size="lg" />
          </Link>
        </div>

        {/* Login Card */}
        <Card className="shadow-card-lg border-0 animate-scale-in" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
                <p className="text-muted-foreground mt-1">Sign in to access your health profile</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-border bg-muted/30"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-border bg-muted/30"
                    />
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>

              {/* Sign up link */}
              <p className="text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
