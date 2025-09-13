import { useState, useEffect, useRef } from "react";
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
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section-id');
            if (sectionId) {
              setVisibleSections(prev => new Set([...prev, sectionId]));
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    // 모든 섹션을 관찰
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <HeroMain />
      <div 
        ref={(el) => (sectionRefs.current['story'] = el)}
        data-section-id="story"
        className={`transform transition-all duration-1000 ease-out ${
          visibleSections.has('story')
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-12 opacity-0'
        }`}
      >
        <StorySection />
      </div>
      <div 
        ref={(el) => (sectionRefs.current['solution'] = el)}
        data-section-id="solution"
        className={`transform transition-all duration-1000 ease-out ${
          visibleSections.has('solution')
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-12 opacity-0'
        }`}
      >
        <SolutionSection />
      </div>
      <div 
        ref={(el) => (sectionRefs.current['screens'] = el)}
        data-section-id="screens"
        className={`transform transition-all duration-1000 ease-out ${
          visibleSections.has('screens')
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-12 opacity-0'
        }`}
      >
        <ScreensSection />
      </div>
      <div 
        ref={(el) => (sectionRefs.current['user-types'] = el)}
        data-section-id="user-types"
        className={`transform transition-all duration-1000 ease-out ${
          visibleSections.has('user-types')
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-12 opacity-0'
        }`}
      >
        <UserTypesSection />
      </div>
      <div 
        ref={(el) => (sectionRefs.current['pricing'] = el)}
        data-section-id="pricing"
        className={`transform transition-all duration-1000 ease-out ${
          visibleSections.has('pricing')
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-12 opacity-0'
        }`}
      >
        <PricingSection />
      </div>
      <div 
        ref={(el) => (sectionRefs.current['testimonials'] = el)}
        data-section-id="testimonials"
        className={`transform transition-all duration-1000 ease-out ${
          visibleSections.has('testimonials')
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-12 opacity-0'
        }`}
      >
        <TestimonialsSection />
      </div>
      <div 
        ref={(el) => (sectionRefs.current['faq'] = el)}
        data-section-id="faq"
        className={`transform transition-all duration-1000 ease-out ${
          visibleSections.has('faq')
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-12 opacity-0'
        }`}
      >
        <FAQSection />
      </div>
      <div 
        ref={(el) => (sectionRefs.current['cta'] = el)}
        data-section-id="cta"
        className={`transform transition-all duration-1000 ease-out ${
          visibleSections.has('cta')
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-12 opacity-0'
        }`}
      >
        <CTASection />
      </div>
      <div 
        ref={(el) => (sectionRefs.current['footer'] = el)}
        data-section-id="footer"
        className={`transform transition-all duration-1000 ease-out ${
          visibleSections.has('footer')
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-12 opacity-0'
        }`}
      >
        <Footer />
      </div>
    </div>
  );
};

export default Hero;