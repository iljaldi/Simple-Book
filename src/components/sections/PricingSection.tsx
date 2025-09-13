import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Crown, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSection = () => {
  return (
    <section id="pricing" className="px-4 pt-48 pb-48 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-[1056px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground mb-6 leading-tight">
            <div>특별한 혜택!</div>
            <div className="mt-3">베타 서비스 기간 동안 <span className="text-purple-600">무료로 사용하세요</span></div>
          </h2>
        </div>

        <div className="flex justify-center mb-16">
          <div className="w-full max-w-2xl">
            {/* 스타터 요금제 */}
            <Card className="p-8 shadow-card relative flex flex-col h-full">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground">스타터</h3>
                <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold mt-1 inline-block">무료</div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex items-start space-x-3">
                  <i className="ri-check-line h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground mb-1">기본 장부 관리</div>
                    <div className="text-sm text-muted-foreground">프리랜서 활동으로 발생한 모든 수입과 지출을 체계적으로 관리</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <i className="ri-check-line h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground mb-1">자동 분류</div>
                    <div className="text-sm text-muted-foreground">거래를 자동으로 분류하고 세무 증빙과 연결</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <i className="ri-check-line h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground mb-1">빠른 거래 입력</div>
                    <div className="text-sm text-muted-foreground">5초 만에 끝나는 간편한 거래 입력</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <i className="ri-check-line h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground mb-1">OCR 영수증 업로드</div>
                    <div className="text-sm text-muted-foreground">사진만 찍으면 자동으로 영수증 정보 인식</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <i className="ri-check-line h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground mb-1">보고서 PDF 다운로드</div>
                    <div className="text-sm text-muted-foreground">클릭 한 번으로 세무 보고서 완성</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-6">
                <p className="text-sm text-blue-800">
                  베타 서비스 기간 동안 모든 기능을 무료로 체험해보세요
                </p>
              </div>
            </Card>
            
            <div className="flex justify-center mt-6">
              <Button size="lg" className="w-1/2 bg-black hover:bg-gray-800 text-white rounded-full py-3 border-0 shadow-none font-medium transition-colors" asChild>
                <Link to="/auth">무료로 시작하기</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;