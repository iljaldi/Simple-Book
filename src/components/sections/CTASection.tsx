import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="bg-white pt-48 pb-48 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-[1.2] mb-6">
          <div>1인 기업·프리랜서 장부 관리,</div>
          <div className="mt-3 text-purple-600">Simple Book과 시작하세요</div>
        </h2>
        
        <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
          세금 스트레스는 줄이고, 본업에만 집중하세요.
        </p>
        

        {/* CTA 버튼 */}
        <div className="flex justify-center mb-16">
          <Button 
            size="lg"
            className="bg-black text-white text-lg px-8 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium"
            asChild
          >
            <Link to="/auth">
              무료로 시작하기
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;