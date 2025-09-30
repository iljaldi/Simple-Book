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
      className="min-h-screen bg-white relative flex flex-col justify-center"
    >
      {/* Background image with responsive sizing */}
      <div 
        className={`absolute inset-0 transform transition-all duration-1000 ease-out ${
          isLoaded 
            ? 'opacity-20 sm:opacity-25' 
            : 'opacity-0'
        }`}
        style={{
          backgroundImage: 'url(/images/main-hero-bg.png)',
          backgroundSize: 'auto 40%, auto 50%, auto 60%',
          backgroundPosition: 'center 10%, center 15%, center 20%',
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
               <div className="flex justify-between items-center max-w-6xl mx-auto px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
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
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* Navigation Links */}
            <div className="hidden sm:flex items-center space-x-4 lg:space-x-6">
              <button 
                onClick={() => scrollToSection('solution')} 
                className="text-xs sm:text-sm font-medium text-black hover:text-gray-600 transition-colors"
              >
                기능
              </button>
              <button 
                onClick={() => scrollToSection('faq')} 
                className="text-xs sm:text-sm font-medium text-black hover:text-gray-600 transition-colors"
              >
                FAQ
              </button>
            </div>
            
            {/* CTA Button */}
            {user ? (
              <Button 
                size="sm" 
                className="bg-black text-white hover:bg-gray-800 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-colors"
                asChild
              >
                <Link to="/dashboard">
                  <span className="hidden sm:inline">대시보드</span>
                  <span className="sm:hidden">대시보드</span>
                </Link>
              </Button>
            ) : (
              <div className="relative group">
                <Button 
                  size="sm" 
                  className="bg-gray-300 text-gray-500 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-colors cursor-not-allowed"
                  disabled
                  asChild
                >
                  <span aria-disabled="true" className="pointer-events-none">
                    <span className="hidden sm:inline">설문 참여하기</span>
                    <span className="sm:hidden">설문 참여</span>
                  </span>
                </Button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  설문 조사가 마감되었습니다
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="hero" 
        className="relative z-10 px-4 pt-16 pb-4 sm:pt-20 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:pt-28 xl:pt-32"
      >
        <div className="max-w-[1056px] mx-auto w-full">
          <div className="text-center">
            {/* Main Headline */}
            <div className="mb-6 sm:mb-8 lg:mb-12">
              <h1 className="text-[1.5rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black leading-[1.1] sm:leading-[1.2] mb-3 sm:mb-4 lg:mb-6">
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
                  className={`mt-1 sm:mt-2 lg:mt-3 text-purple-600 transform transition-all duration-700 ease-out ${
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
                className={`text-[1rem] sm:text-base md:text-lg lg:text-xl text-gray-700 mb-1 sm:mb-1 leading-relaxed max-w-2xl mx-auto px-2 sm:px-4 transform transition-all duration-700 ease-out ${
                  isLoaded 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '0.5s' }}
              >
                <span className="block sm:hidden">수입·지출 정리부터</span>
                <span className="block sm:hidden">홈택스 제출용 문서(CSV/PDF)까지,</span>
                <span className="block sm:hidden font-bold">단 5분이면 끝</span>
                <span className="hidden sm:inline">수입·지출 정리부터 홈택스 제출용 문서(CSV/PDF)까지, </span>
                <span className="hidden sm:inline font-bold">단 5분이면 끝</span>
              </p>
              <p 
                className={`text-[1rem] sm:text-base md:text-lg lg:text-xl text-gray-700 mb-8 sm:mb-12 lg:mb-16 leading-relaxed max-w-2xl mx-auto px-2 sm:px-4 transform transition-all duration-700 ease-out ${
                  isLoaded 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '0.7s' }}
              >
                심플북 설문 조사 참여하고 선물 받아가세요!
              </p>
              <p 
                className={`text-[1.25rem] sm:text-lg md:text-xl lg:text-2xl font-bold text-black mb-2 sm:mb-3 leading-relaxed max-w-2xl mx-auto px-2 sm:px-4 transform transition-all duration-700 ease-out ${
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
              className={`flex justify-center mb-8 sm:mb-12 lg:mb-16 px-4 mt-8 sm:mt-12 lg:mt-16 transform transition-all duration-700 ease-out ${
                isLoaded 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: '0.7s' }}
            >
              <div className="relative group">
                <Button 
                  size="lg"
                  className="bg-gray-300 text-gray-500 text-sm sm:text-base md:text-lg lg:text-xl px-6 sm:px-8 md:px-10 lg:px-12 py-4 sm:py-5 md:py-6 lg:py-8 rounded-full transition-colors font-medium w-full sm:w-auto max-w-xs sm:max-w-none cursor-not-allowed"
                  disabled
                  asChild
                >
                  <span aria-disabled="true" className="pointer-events-none">
                    <span className="hidden sm:inline">설문 참여하고 얼리 엑세스 받기</span>
                    <span className="sm:hidden">설문 참여하고 선물받기</span>
                  </span>
                </Button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  설문 조사가 마감되었습니다
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="relative z-20 flex justify-center pb-32 sm:pb-48 lg:pb-64 xl:pb-80 px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 lg:mt-16">
        <video 
          src="/video/hero.mp4" 
          autoPlay
          loop
          muted
          playsInline
          className="relative z-20 w-full max-w-[800px] sm:max-w-[1000px] lg:max-w-[1200px] xl:max-w-[1400px] rounded-2xl"
          style={{
            filter: 'drop-shadow(0 6px 12px rgba(148, 20, 209, 0.06)) drop-shadow(0 2px 4px rgba(148, 20, 209, 0.03))'
          }}
        />
      </section>
    </div>
  );
};

export default HeroMain;