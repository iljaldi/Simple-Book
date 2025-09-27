import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Crown, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSection = () => {
  return (
    <section id="pricing" className="px-4 pt-48 pb-48 sm:px-6 lg:px-8" style={{backgroundColor: 'var(--color-purple-600)'}}>
      <div className="max-w-[1056px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white mb-6 leading-tight">
            <div>설문 조사 참여하고 선물받자!</div>
          </h2>
          <p className="font-medium text-white" style={{fontSize: '1.5rem'}}>
            설문 조사에 참여하시면 특별한 혜택을 드려요
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="w-full max-w-2xl">
            {/* 스타터 요금제 */}
            <Card className="p-16 shadow-card relative flex flex-col h-full">
              <div className="mb-6">
              <h3 className="text-3xl sm:text-4xl font-bold text-center" style={{color: '#9333ea'}}>
                <div className="text-lg sm:text-xl mb-2">선착순 100명</div>
                <div>얼리 액세스 라이선스 9,900원</div>
              </h3>
              </div>

              <div className="-mt-2 text-center space-y-3">
                <p className="text-base sm:text-lg text-black">
                  홈택스 제출용 문서 <span className="font-bold">무제한 다운로드</span> 포함<br />
                  (정식 론칭 후에도 동일 계정 유지 시)
                </p>
                <div>
                  <p className="text-sm font-semibold text-black mb-8">
                    보너스: 세무 용어 설명집 PDF
                  </p>
                  <div className="border-t border-gray-200 pt-8 mb-16">
                    <p className="text-base text-black">
                      <span className="font-bold text-xl" style={{color: '#9333ea'}}>기간: 9월 28일 09:00 ~ 9월 30일 23:59</span><br />
                      <span className="text-sm text-gray-500">본 혜택은 기간 한정으로, 동일 조건으로 재오픈되지 않을 수 있습니다.</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center mt-8">
                  <Button size="lg" className="w-3/4 bg-black hover:bg-gray-800 text-white rounded-full py-4 border-0 shadow-none font-medium transition-colors text-base" asChild>
                    <Link to="/auth">설문 참여하고 얼리 액세스 받기</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;