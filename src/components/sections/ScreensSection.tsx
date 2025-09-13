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
      image: "/images/view-1.png",
    },
    {
      id: 2,
      title: "영수증 OCR 업로드",
      description: "사진만 찍으면 자동 인식",
      icon: "ri-smartphone-line",
      image: "/images/view-2.png",
    },
    {
      id: 3,
      title: "세무 보고서 PDF",
      description: "클릭 한 번으로 완성",
      icon: "ri-file-text-line",
      image: "/images/view-3.png",
    },
  ];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 250);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 250);
  };

  // 자동 슬라이드 기능
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % slides.length);
          setTimeout(() => {
            setIsTransitioning(false);
          }, 50);
        }, 250);
      }
    }, 6000); // 6초마다 자동 슬라이드 (전환 시간 고려)

    return () => clearInterval(interval);
  }, [slides.length, isTransitioning]);

  return (
    <section id="features" className="px-4 pt-48 pb-48 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-[1056px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground mb-6 leading-tight">
            실제 화면으로 확인하세요
          </h2>
        </div>

        <div className="flex justify-center">
          <div className={`w-full max-w-[1056px] relative border border-gray-200 rounded-lg overflow-hidden transition-opacity duration-500 ease-in-out ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}>
            <img 
              key={currentSlide}
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-auto object-contain"
            />
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