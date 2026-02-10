import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import HealixLogo from "@/components/HealixLogo";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/motion/MotionWrappers";
import { API_BASE_URL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/patients/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast({ title: "Login failed", description: data.detail || data.error || "Invalid credentials", variant: "destructive" });
        setLoading(false);
        return;
      }
      // Store user info for later API calls
      const patient = data.patient || data.data;
      if (patient?.id) {
        localStorage.setItem("healix_user_id", patient.id);
        localStorage.setItem("healix_user_email", email);
      }
      window.location.href = "/dashboard";
    } catch (err) {
      toast({ title: "Error", description: "Could not connect to server.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
        {/* Subtle decorative elements */}
        <div className="fixed top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Logo */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0.8, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/">
                <HealixLogo size="lg" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0.9, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="shadow-card-lg border-0 bg-card/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
                    <p className="text-muted-foreground mt-1">Sign in to access your health profile</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-12 rounded-xl border-border/60 bg-muted/30 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link 
                          to="/forgot-password" 
                          className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 h-12 rounded-xl border-border/60 bg-muted/30 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit */}
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-shadow duration-300 hover:shadow-lg"
                      >
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Sign In
                        {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                      </Button>
                    </motion.div>
                  </form>

                  {/* Sign up link */}
                  <p className="text-center text-muted-foreground">
                    Don't have an account?{" "}
                    <Link 
                      to="/signup" 
                      className="text-primary font-medium hover:text-primary/80 transition-colors duration-300"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
