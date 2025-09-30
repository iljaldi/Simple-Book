import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import HeroMain from "./sections/HeroMain";
import StorySection from "./sections/StorySection";
import SolutionSection from "./sections/SolutionSection";
import UserTypesSection from "./sections/UserTypesSection";
import PricingSection from "./sections/PricingSection";
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
        <title>Simple Book - 독립한 디자이너를 위한 5분 간편장부 | 홈택스 세금신고 무료</title>
        <meta name="description" content="독립한 디자이너를 위한 간편장부 서비스. 5분 만에 수입·지출 기록하고 홈택스 세금신고 자료를 자동 생성하세요. 무료로 시작하세요!" />
        <meta name="keywords" content="간편장부, 디자이너장부, 독립디자이너, 프리랜서장부, 세금신고, 홈택스, 장부관리, 개인사업자, 솔로프리너, 디자이너세금신고" />
        <meta property="og:title" content="Simple Book - 독립한 디자이너를 위한 5분 간편장부 | 홈택스 세금신고 무료" />
        <meta property="og:description" content="독립한 디자이너를 위한 간편장부 서비스. 5분 만에 수입·지출 기록하고 홈택스 세금신고 자료를 자동 생성하세요. 무료로 시작하세요!" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://simplebook.site/images/og.png" />
        <link rel="canonical" href="https://simplebook.site/" />
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
      <Footer />
    </div>
  );
};

export default Hero;