import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const UserTypesSection = () => {
  return (
    <section className="px-4 pt-48 pb-48 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-[1056px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground mb-6 leading-tight">
            <div className="text-purple-600">사업자등록 여부와 상관없이</div>
            <div className="mt-3">Simple Book은 필요합니다</div>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* 비사업자 프리랜서 */}
          <Card className="p-8 shadow-card flex flex-col h-full">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground">비사업자 프리랜서</h3>
              <Badge variant="outline" className="mt-1">개인사업자 미등록</Badge>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex items-start space-x-3">
                <i className="ri-check-line h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                <div className="font-semibold text-foreground mb-1">합법적으로 세금 절약을 위한 증빙</div>
                <div className="text-sm text-muted-foreground">장부 없으면 경비 처리 한계 → 세금 더 냄</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <i className="ri-check-line h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                <div className="font-semibold text-foreground mb-1">소명요청과 가산세 리스크 방지</div>
                <div className="text-sm text-muted-foreground">누락·착오로 인한 가산세도 예방</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <i className="ri-check-line h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                <div className="font-semibold text-foreground mb-1">단가를 알기 위한 비용 구조 파악</div>
                <div className="text-sm text-muted-foreground">장부로 원가·이익률이 보이면 견적을 한눈에 파악</div>
                </div>
              </div>
            </div>

          </Card>

          {/* 사업자 프리랜서 */}
          <Card className="p-8 shadow-card flex flex-col h-full">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground">사업자 프리랜서</h3>
              <Badge className="mt-1 bg-black text-white">개인사업자 등록</Badge>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex items-start space-x-3">
                <i className="ri-check-line h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground mb-1">자동 분류/증빙 매핑</div>
                  <div className="text-sm text-muted-foreground">거래를 자동으로 분류하고 세무 증빙과 연결</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <i className="ri-check-line h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground mb-1">부가세·소득세 보고서 자동 생성</div>
                  <div className="text-sm text-muted-foreground">복잡한 세무 신고서를 클릭 한 번으로 완성</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <i className="ri-check-line h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground mb-1">비용 인정 통한 절세</div>
                  <div className="text-sm text-muted-foreground">필요경비를 정확히 관리해서 세금 부담을 줄임</div>
                </div>
              </div>

            </div>

          </Card>
        </div>
      </div>
    </section>
  );
};

export default UserTypesSection;