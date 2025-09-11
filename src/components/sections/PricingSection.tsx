import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Crown, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSection = () => {
  return (
    <section id="pricing" className="px-4 pt-48 pb-48 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground mb-6 leading-tight">
            1인 기업·프리랜서를 위한 맞춤 요금제
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* 스타터 요금제 */}
          <Card className="p-8 shadow-card relative flex flex-col h-full">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Zap className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">스타터</h3>
              <div className="text-4xl font-bold text-foreground mb-2">무료</div>
              <p className="text-muted-foreground">처음 시작하는 프리랜서라면 무료로 경험해보세요.</p>
            </div>
            <ul className="space-y-4 flex-1 mb-8">
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                <span className="text-foreground">광고 노출</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                <span className="text-foreground">기본 장부 관리</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                <span className="text-foreground">자동 분류</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                <span className="text-foreground">빠른 거래 입력</span>
              </li>
            </ul>
            <Button variant="outline" size="lg" className="w-full rounded-full py-3" asChild>
              <Link to="/auth">무료로 시작하기</Link>
            </Button>
          </Card>

          {/* 프로 요금제 */}
          <Card className="p-8 shadow-card relative border-purple-600 border-2">
            <div className="absolute top-4 left-4">
              <span className="bg-purple-600 text-white px-6 py-2 rounded-full text-base font-semibold">
                추천
              </span>
            </div>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Crown className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">프로</h3>
              <div className="text-4xl font-bold text-purple-600 mb-2">₩9,900<span className="text-lg text-purple-600">/월</span></div>
              <p className="text-purple-600">광고 없이, 모든 핵심 기능을 활용하세요.</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <span className="text-purple-600">광고 제거</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <span className="text-purple-600">기본 장부 관리</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <span className="text-purple-600">자동 분류</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <span className="text-purple-600">빠른 거래 입력</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <span className="text-purple-600">OCR 영수증 업로드</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <span className="text-purple-600">보고서 PDF 다운로드</span>
              </li>
            </ul>
            <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full py-3 border-0 shadow-none" asChild>
              <Link to="/auth">시작하기</Link>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;