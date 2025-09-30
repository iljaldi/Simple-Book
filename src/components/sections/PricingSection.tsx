import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Crown, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSection = () => {
  return (
    <section id="pricing" className="px-4 pt-16 pb-[4.5rem] sm:pt-48 sm:pb-48 lg:pt-48 lg:pb-32 xl:pt-48 xl:pb-32 sm:px-6 lg:px-8" style={{backgroundColor: 'var(--color-purple-600)'}}>
      <div className="max-w-[1056px] mx-auto">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="text-[1.5rem] sm:text-2xl md:text-3xl lg:text-[56px] xl:text-[56px] font-bold text-white mb-1 sm:mb-6 lg:mb-8 xl:mb-8 leading-tight">이벤트</div>
          <h2 className="text-[1.5rem] sm:text-2xl md:text-3xl lg:text-[56px] xl:text-[56px] font-bold text-white mb-4 sm:mb-6 leading-tight">
            <div>설문 조사 참여하고 선물받자!</div>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white">
            설문 조사에 참여하시면 특별한 혜택을 드려요
          </p>
        </div>

        <div className="flex justify-center mb-12 sm:mb-16 lg:mb-20">
          <div className="w-full max-w-2xl">
            {/* 스타터 요금제 */}
            <Card className="p-8 sm:p-12 lg:p-16 shadow-card relative flex flex-col h-full">
              <div className="mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center" style={{color: '#9333ea'}}>
              <div>
                <span className="block sm:hidden">얼리 액세스 라이선스 9,900원</span>
                <span className="block sm:hidden">구매 혜택</span>
                <span className="hidden sm:block">얼리 액세스 라이선스 9,900원 구매 혜택</span>
              </div>
            </h3>
              </div>

              <div className="-mt-2 text-center space-y-2 sm:space-y-3">
                <p className="text-base sm:text-base md:text-lg text-black">
                  홈택스 제출용 문서 <span className="font-bold">무제한 다운로드</span> 포함<br />
                  (정식 론칭 후에도 동일 계정 유지 시)
                </p>
                <div>
                  <p className="text-base sm:text-sm font-semibold text-black mb-4 sm:mb-6 lg:mb-8">
                    보너스: 세무 용어 설명집 PDF
                  </p>
                  <div className="border-t border-gray-200 pt-4 sm:pt-6 lg:pt-8 mb-8 sm:mb-12 lg:mb-16">
                    <p className="text-sm sm:text-base text-black">
                      <span className="font-bold text-base sm:text-lg md:text-xl" style={{color: '#9333ea'}}>기간: 9월 28일 09:00 ~ 9월 30일 23:59</span><br />
                      <span className="text-xs sm:text-sm text-gray-500">
                        <span className="block sm:hidden">본 혜택은 기간 한정으로,</span>
                        <span className="block sm:hidden">동일 조건으로 재오픈되지 않을 수 있습니다.</span>
                        <span className="hidden sm:inline">본 혜택은 기간 한정으로, 동일 조건으로 재오픈되지 않을 수 있습니다.</span>
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center mt-4 sm:mt-6 lg:mt-8">
                  <div className="relative group w-full sm:w-3/4">
                    <Button size="lg" className="w-full bg-gray-300 text-gray-500 rounded-full py-3 sm:py-4 lg:py-5 border-0 shadow-none font-medium transition-colors text-sm sm:text-base cursor-not-allowed" disabled asChild>
                      <span aria-disabled="true" className="pointer-events-none">설문 참여하고 얼리 액세스 받기</span>
                    </Button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      설문 조사가 마감되었습니다
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
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