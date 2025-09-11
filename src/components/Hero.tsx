import HeroMain from "./sections/HeroMain";
import StorySection from "./sections/StorySection";
import SolutionSection from "./sections/SolutionSection";
import ScreensSection from "./sections/ScreensSection";
import UserTypesSection from "./sections/UserTypesSection";
import PricingSection from "./sections/PricingSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import FAQSection from "./sections/FAQSection";
import CTASection from "./sections/CTASection";
import Footer from "./sections/Footer";

const Hero = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroMain />
      <StorySection />
      <SolutionSection />
      <ScreensSection />
      <UserTypesSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Hero;