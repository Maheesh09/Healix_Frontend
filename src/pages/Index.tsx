import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import JourneySection from "@/components/landing/JourneySection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import { PageTransition } from "@/components/motion/MotionWrappers";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <LandingHeader />
        <main className="flex-1">
          <HeroSection />
          <FeaturesSection />
          <JourneySection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
