import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CountdownTimer from "@/components/CountdownTimer";

const HeroMain = () => {
  const [isFeatureDropdownOpen, setIsFeatureDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // 페이지 로드 시 애니메이션 시작
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.querySelector(`[data-section-id="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="min-h-screen bg-white relative"
    >
      {/* Background image with 50% transparency */}
      <div 
        className={`absolute inset-0 transform transition-all duration-1000 ease-out ${
          isLoaded 
            ? 'opacity-25' 
            : 'opacity-0'
        }`}
        style={{
          backgroundImage: 'url(/images/main-hero-bg.png)',
          backgroundSize: 'auto 80%',
          backgroundPosition: 'center 20%',
          backgroundRepeat: 'no-repeat',
          animation: 'float 6s ease-in-out infinite, fadeInOut 8s ease-in-out infinite'
        }}
      ></div>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-100/50 backdrop-blur-md' 
          : 'bg-transparent'
      }`}>
        <div className="flex justify-between items-center max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
              <i className="ri-book-open-line text-white text-sm" />
            </div>
            <span className="text-lg font-bold text-black">Simple Book</span>
          </button>
          
          {/* Navigation Links and CTA Button */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('solution')} 
                className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
              >
                기능
              </button>
              <button 
                onClick={() => scrollToSection('faq')} 
                className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
              >
                FAQ
              </button>
            </div>
            
            {/* CTA Button */}
            <Button 
              size="sm" 
              className="bg-black text-white hover:bg-gray-800 rounded-full px-4 py-2 text-sm font-medium transition-colors"
              asChild
            >
              <Link to={user ? "/dashboard" : "/auth"}>
                {user ? "대시보드" : "설문 참여하기"}
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="hero" 
        className="relative z-10 px-4 pt-20 pb-4 sm:px-6 lg:px-8 mt-16 sm:pt-28"
      >
        <div className="max-w-[1056px] mx-auto w-full">
          <div className="text-center">
            {/* Main Headline */}
            <div className="mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-[1.2] mb-4 sm:mb-6">
                <div 
                  className={`transform transition-all duration-700 ease-out ${
                    isLoaded 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: '0.1s' }}
                >
                  독립한 디자이너를 위한
                </div>
                <div 
                  className={`mt-2 sm:mt-3 text-purple-600 transform transition-all duration-700 ease-out ${
                    isLoaded 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: '0.3s' }}
                >
                  가장 쉬운 간편 장부
                </div>
              </h1>
              <p 
                className={`text-base sm:text-lg md:text-xl text-gray-700 mb-1 sm:mb-1 leading-relaxed max-w-2xl mx-auto px-4 transform transition-all duration-700 ease-out ${
                  isLoaded 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '0.5s' }}
              >
                수입·지출 정리부터 홈택스 제출용 문서(CSV/PDF)까지, <span className="font-bold">단 5분이면 끝</span>
              </p>
                     <p 
                       className={`text-base sm:text-lg md:text-xl text-gray-700 mb-12 sm:mb-16 leading-relaxed max-w-2xl mx-auto px-4 transform transition-all duration-700 ease-out ${
                         isLoaded 
                           ? 'translate-y-0 opacity-100' 
                           : 'translate-y-8 opacity-0'
                       }`}
                       style={{ transitionDelay: '0.7s' }}
                     >
                       심플북 설문 조사 참여하고 선물 받아가세요!
                     </p>
              <p 
                className={`text-lg sm:text-xl md:text-2xl font-bold text-black mb-2 sm:mb-3 leading-relaxed max-w-2xl mx-auto px-4 transform transition-all duration-700 ease-out ${
                  isLoaded 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '0.9s' }}
              >
                설문 마감까지 남은 시간
              </p>
              <div 
                className={`text-center mb-6 sm:mb-8 px-4 transform transition-all duration-700 ease-out ${
                  isLoaded 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '1.1s' }}
              >
                <CountdownTimer />
              </div>
            </div>

            {/* CTA Button */}
            <div 
              className={`flex justify-center mb-12 sm:mb-16 px-4 transform transition-all duration-700 ease-out ${
                isLoaded 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: '0.7s' }}
            >
              <Button 
                size="lg"
                className="bg-purple-600 text-white text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 rounded-full hover:bg-purple-700 transition-colors font-medium w-full sm:w-auto"
                asChild
              >
                <Link to="/auth">
                  설문 참여하고 얼리 엑세스 받기
                </Link>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="relative z-20 flex justify-center pb-48 sm:pb-64">
        <video 
          src="/video/hero.mp4" 
          autoPlay
          loop
          muted
          playsInline
          className="relative z-20 w-full max-w-[1200px] rounded-2xl"
          style={{
            filter: 'drop-shadow(0 6px 12px rgba(148, 20, 209, 0.06)) drop-shadow(0 2px 4px rgba(148, 20, 209, 0.03))'
          }}
        />
      </section>
    </div>
  );
};

export default HeroMain;