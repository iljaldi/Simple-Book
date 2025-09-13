import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

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
    const element = document.getElementById(id);
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
          transform: 'none',
          backgroundImage: 'url(/images/main-hero-bg.png)',
          backgroundSize: 'auto 80%',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
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
            onClick={() => scrollToSection('hero')} 
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
                onClick={() => scrollToSection('about')} 
                className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
              >
                서비스 소개
              </button>
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
              >
                기능
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
              >
                요금제
              </button>
            </div>
            
            {/* CTA Button */}
            <Button 
              size="sm" 
              className="bg-black text-white hover:bg-gray-800 rounded-full px-4 py-2 text-sm font-medium transition-colors"
              asChild
            >
              <Link to={user ? "/dashboard" : "/auth"}>
                {user ? "대시보드" : "무료로 시작하기"}
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
                className={`text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4 transform transition-all duration-700 ease-out ${
                  isLoaded 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '0.5s' }}
              >
                수입·지출 관리부터 홈택스 PDF 추출까지<br />
                단 5분이면 충분합니다.
              </p>
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
                className="bg-black text-white text-base sm:text-lg px-6 sm:px-8 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium w-full sm:w-auto"
                asChild
              >
                <Link to="/auth">
                  무료로 시작하기
                </Link>
              </Button>
            </div>

            {/* Trust Section */}
            <div 
              className={`text-center mb-8 px-4 transform transition-all duration-700 ease-out ${
                isLoaded 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: '0.9s' }}
            >
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                이미 많은 1인 기업·프리랜서 디자이너들이 사용하고 있습니다
              </p>
              {/*<div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-full">개발자</span>
                <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-full">디자이너</span>
                <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-full">마케터</span>
                <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-full">컨설턴트</span>
                <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-full">작가</span>
                <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-full">강사</span>
                <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-full">크리에이터</span>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="relative z-20 flex justify-center">
        <img 
          src="/images/main-hero.png" 
          alt="Simple Book 메인 화면" 
          className={`relative z-20 w-full max-w-[1056px] drop-shadow-lg transform transition-all duration-700 ease-out ${
            isLoaded 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
          }`}
          style={{
            filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.08)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.06)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.03))',
            animation: 'float 3s ease-in-out infinite',
            transitionDelay: '1.1s'
          }}
        />
      </section>
    </div>
  );
};

export default HeroMain;