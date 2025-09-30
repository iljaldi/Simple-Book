import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="bg-white pt-0 pb-16 sm:pt-24 sm:pb-48 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1056px] mx-auto text-center">
        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-[1.2] mb-4 sm:mb-6">
          <div>독립한 디자이너의 장부 관리,</div>
          <div className="mt-1.5 sm:mt-3 text-purple-600">Simple Book과 시작하세요</div>
        </h2>
        
        <p className="text-base sm:text-xl text-gray-700 mb-0 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
          <span className="block sm:inline">디자인에만 집중하세요.</span>
          <span className="block sm:inline">세무는 심플북이 챙깁니다.</span>
        </p>
        

      </div>
    </section>
  );
};

export default CTASection;