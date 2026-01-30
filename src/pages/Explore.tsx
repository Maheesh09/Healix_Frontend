import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HealixLogo from "@/components/HealixLogo";
import { Heart, MessageCircle, Brain, Shield, User, Lock, ArrowLeft, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition, StaggerContainer, StaggerItem, HoverCard } from "@/components/motion/MotionWrappers";

const features = [
  {
    icon: Heart,
    title: "Anatomy-First Health Records",
    description: "Unlike traditional systems that sort reports by date, Healix organizes medical data by body system, helping patients and doctors understand health conditions more intuitively.",
  },
  {
    icon: MessageCircle,
    title: "Upload Reports via WhatsApp",
    description: "Patients can forward medical reports directly from WhatsApp or Telegram, eliminating the need for scanning, printing, or manual uploads.",
  },
  {
    icon: Brain,
    title: "AI Insights in Simple Language",
    description: "Healix uses AI to analyze medical reports and present easy-to-understand insights, trends, and alerts for awareness - not diagnosis.",
  },
];

const trustBadges = [
  {
    icon: Shield,
    title: "Non-diagnostic AI insights",
  },
  {
    icon: User,
    title: "User-controlled data access",
  },
  {
    icon: Lock,
    title: "User-controlled data access",
  },
];

const Explore = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <motion.header
          className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          initial={{ opacity: 0.9, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container flex h-16 items-center justify-between">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/">
                <HealixLogo size="md" />
              </Link>
            </motion.div>

            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  asChild
                  className="rounded-full border-primary text-primary hover:bg-primary/5 transition-colors duration-300 px-3 sm:px-4"
                >
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Back to home</span>
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button
                  asChild
                  className="rounded-full bg-primary hover:bg-primary/90 transition-shadow duration-300 hover:shadow-lg"
                >
                  <Link to="/signup">Get Started</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.header>

        <main className="flex-1">
          {/* Why Healix is Different Section */}
          <section className="py-20 bg-background">
            <div className="container">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0.8, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Why Healix is <span className="text-primary">Different</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Designed to simplify healthcare, improve understanding, and empower patients through intelligent technology.
                </p>
              </motion.div>

              <StaggerContainer className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {features.map((feature, index) => (
                  <StaggerItem key={index}>
                    <HoverCard>
                      <div className="bg-card border border-border rounded-2xl p-6 h-full">
                        <motion.div
                          className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <feature.icon className="h-6 w-6 text-primary" />
                        </motion.div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </HoverCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* Built on Trust & Safety Section */}
          <section className="py-16 bg-muted/30">
            <div className="container">
              <motion.div
                className="text-center mb-10"
                initial={{ opacity: 0.8, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
                  Built on Trust & Safety
                </h2>
                <p className="text-muted-foreground">
                  Your health data deserves the highest standards of protection
                </p>
              </motion.div>

              <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
                {trustBadges.map((badge, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 bg-card border border-border rounded-full px-6 py-3"
                    initial={{ opacity: 0.8, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <badge.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {badge.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-background">
            <div className="container">
              <motion.div
                className="max-w-2xl mx-auto bg-card border border-border rounded-3xl p-10 text-center"
                initial={{ opacity: 0.9, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  Healthcare designed around{" "}
                  <span className="text-primary">people</span>,
                  <br />not paperwork.
                </h2>
                <p className="text-muted-foreground mb-8">
                  Join thousands who have simplified their health journey with Healix.
                </p>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block"
                >
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-primary hover:bg-primary/90 font-semibold px-6 sm:px-8 h-auto py-4 transition-shadow duration-300 hover:shadow-lg w-full sm:w-auto"
                  >
                    <Link to="/signup" className="text-center leading-tight">Start your Digital Health<br className="sm:hidden" /> Journey</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-muted py-12">
          <div className="container">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div>
                <HealixLogo size="md" />
                <p className="text-muted-foreground text-sm mt-4 leading-relaxed">
                  Your lifelong digital health profile. Understand, track, and organize your medical history in one secure place.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
                  Quick Links
                </h4>
                <ul className="space-y-2">
                  {["Dashboard", "Reports", "Trends", "Upload"].map((link) => (
                    <li key={link}>
                      <Link
                        to={`/${link.toLowerCase()}`}
                        className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
                  Support
                </h4>
                <ul className="space-y-2">
                  {["Help Center", "Privacy Policy", "Terms of Service", "Contact Us"].map((link) => (
                    <li key={link}>
                      <span className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300 cursor-pointer">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
                  Contact
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    +94 712 345 678
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Mail className="h-4 w-4 text-primary" />
                    support@healix.com
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4 text-primary mt-0.5" />
                    123 health street, med city Colombo
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground text-sm">
                © 2026 Healix. All rights reserved.
              </p>
              <div className="flex items-center gap-3">
                {[
                  { icon: Facebook, label: "Facebook" },
                  { icon: Instagram, label: "Instagram" },
                  { icon: Linkedin, label: "LinkedIn" },
                  { icon: Twitter, label: "Twitter" },
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href="#"
                    className="w-10 h-10 bg-muted-foreground/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4 text-muted-foreground" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Explore;
