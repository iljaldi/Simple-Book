import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const ScreensSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      id: 1,
      title: "거래 입력 드로어",
      description: "5초 만에 끝나는 간편 입력",
      icon: "ri-computer-line",
    },
    {
      id: 2,
      title: "영수증 OCR 업로드",
      description: "사진만 찍으면 자동 인식",
      icon: "ri-smartphone-line",
    },
    {
      id: 3,
      title: "세무 보고서 PDF",
      description: "클릭 한 번으로 완성",
      icon: "ri-file-text-line",
    },
  ];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 300);
  };

  // 자동 슬라이드 기능
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % slides.length);
          setIsTransitioning(false);
        }, 300);
      }
    }, 4000); // 4초마다 자동 슬라이드 (전환 시간 고려)

    return () => clearInterval(interval);
  }, [slides.length, isTransitioning]);

  return (
    <section id="features" className="px-4 pt-48 pb-48 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground mb-6 leading-tight">
            실제 화면으로 확인해보세요
          </h2>
        </div>

        <div className="bg-gray-100 rounded-3xl p-8 sm:p-12">
          {/* Preview Card */}
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg w-[1056px]">
              <div className="aspect-[9/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div 
                  key={currentSlide}
                  className={`text-center ${isTransitioning ? 'animate-slide-out' : 'animate-slide-in'}`}
                >
                  <div className="w-20 h-20 bg-black rounded-xl flex items-center justify-center mx-auto mb-6">
                    <i className={`ri ${slides[currentSlide].icon} text-3xl text-white`} />
                  </div>
                  <p className="text-base text-gray-600">{slides[currentSlide].title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-center mt-8 space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full w-12 h-12 p-0 border-gray-300 hover:bg-black hover:border-black hover:text-white transition-colors duration-200"
            onClick={prevSlide}
          >
            <i className="ri-arrow-left-s-line h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full w-12 h-12 p-0 border-gray-300 hover:bg-black hover:border-black hover:text-white transition-colors duration-200"
            onClick={nextSlide}
          >
            <i className="ri-arrow-right-s-line h-5 w-5" />
          </Button>
        </div>

        {/* 슬라이드 인디케이터 */}
        <div className="flex justify-center items-center space-x-2 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-smooth ${
                currentSlide === index ? 'bg-black' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScreensSection;