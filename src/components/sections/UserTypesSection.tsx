import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const UserTypesSection = () => {
  return (
    <section className="px-4 pt-48 pb-48 sm:px-6 lg:px-8 bg-white">
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
                  <div className="font-semibold text-foreground mb-1">소득·지출 정리</div>
                  <div className="text-sm text-muted-foreground">프리랜서 활동으로 발생한 모든 수입과 지출을 체계적으로 관리</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <i className="ri-check-line h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground mb-1">종합소득세 대비</div>
                  <div className="text-sm text-muted-foreground">연말정산 시기에 필요한 소득 신고 자료를 미리 준비</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <i className="ri-check-line h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground mb-1">실제 순수익 파악</div>
                  <div className="text-sm text-muted-foreground">각종 경비를 제외한 실제 수익을 정확히 계산</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-6">
              <p className="text-sm text-blue-800">
                사업자등록 없이도 연 2천만원 이상 수입이 있으면 종합소득세 신고 의무가 있어요
              </p>
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

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-6">
              <p className="text-sm text-blue-800">
                사업자 프리랜서라면 부가세 신고까지 자동화할 수 있어요
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UserTypesSection;