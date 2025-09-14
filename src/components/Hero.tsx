import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>간편장부 - 프리랜서 1인사업자 3분 장부관리 | Simple Book</title>
        <meta name="description" content="프리랜서와 1인사업자를 위한 간편장부 서비스. 3분 만에 수입·지출 기록하고 홈택스 세금신고 자료를 자동 생성하세요. 무료로 시작하세요!" />
        <meta name="keywords" content="간편장부, 프리랜서장부, 1인사업자장부, 세금신고, 홈택스, 장부관리, 개인사업자, 솔로프리너, 디자이너장부, 개발자장부" />
        <meta property="og:title" content="간편장부 - 프리랜서 1인사업자 3분 장부관리 | Simple Book" />
        <meta property="og:description" content="프리랜서와 1인사업자를 위한 간편장부 서비스. 3분 만에 수입·지출 기록하고 홈택스 세금신고 자료를 자동 생성하세요. 무료로 시작하세요!" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lovable-project-8e6a730d-p24rtr3ha-iljaldis-projects.vercel.app/images/main-hero.png" />
        <link rel="canonical" href="https://lovable-project-8e6a730d-p24rtr3ha-iljaldis-projects.vercel.app/" />
      </Helmet>
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