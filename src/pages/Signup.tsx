import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import HealixLogo from "@/components/HealixLogo";
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/motion/MotionWrappers";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    nic: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiService.register({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
        nic: formData.nic || undefined,
      });

      if (result.success && result.data) {
        // Save patient data and redirect
        login(result.data);
        toast({
          title: "Registration Successful!",
          description: "Welcome to Healix! Redirecting to dashboard...",
        });
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        toast({
          title: "Registration Failed",
          description: result.error || "Unable to create account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4 py-6">
        {/* Subtle decorative elements */}
        <div className="fixed top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-sm space-y-6 relative z-10">
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

          {/* Signup Card */}
          <motion.div
            initial={{ opacity: 0.9, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="shadow-card-lg border-0 bg-card/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h1 className="text-xl font-bold text-foreground">Create Account</h1>
                    <p className="text-sm text-muted-foreground mt-1">Join Healix today</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <Label htmlFor="fullName" className="text-xs">Full Name</Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary" />
                        <Input
                          id="fullName"
                          name="fullName"
                          type="text"
                          placeholder="Full Name"
                          value={formData.fullName}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="pl-9 h-10 text-sm rounded-lg border-border/60 bg-muted/30 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          required
                        />
                      </div>
                    </div>

                    {/* NIC */}
                    <div className="space-y-1">
                      <Label htmlFor="nic" className="text-xs">NIC No</Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary" />
                        <Input
                          id="nic"
                          name="nic"
                          type="text"
                          placeholder="National Identity Card No"
                          value={formData.nic}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="pl-9 h-10 text-sm rounded-lg border-border/60 bg-muted/30 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-xs">Email</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="pl-9 h-10 text-sm rounded-lg border-border/60 bg-muted/30 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-xs">Phone Number</Label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="pl-9 h-10 text-sm rounded-lg border-border/60 bg-muted/30 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <Label htmlFor="password" className="text-xs">Password</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="pl-9 pr-9 h-10 text-sm rounded-lg border-border/60 bg-muted/30 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                      <Label htmlFor="confirmPassword" className="text-xs">Confirm Password</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="pl-9 pr-9 h-10 text-sm rounded-lg border-border/60 bg-muted/30 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit */}
                    <motion.div whileHover={{ scale: isLoading ? 1 : 1.01 }} whileTap={{ scale: isLoading ? 1 : 0.99 }} className="pt-2">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-shadow duration-300 hover:shadow-lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>

                  {/* Login link */}
                  <p className="text-center text-xs text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-primary font-medium hover:text-primary/80 transition-colors duration-300"
                    >
                      Sign in
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

export default Signup;
