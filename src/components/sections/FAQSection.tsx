import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const FAQSection = () => {
  const faqs = [
    {
      question: "사업자등록이 없어도 사용할 수 있나요?",
      answer: "네, 물론입니다. 사업자등록 여부와 상관없이 프리랜서 디자이너 활동으로 발생하는 소득과 지출을 정리할 수 있습니다. 비사업자 프리랜서도 연간 수입이 일정 금액을 넘으면 종합소득세 신고 의무가 있기 때문에 Simple Book으로 미리 준비하실 수 있어요."
    },
    {
      question: "맥북이나 아이폰에서도 사용할 수 있나요?",
      answer: "네, 모든 디바이스에서 사용 가능합니다. 웹 기반 서비스로 맥북, 아이폰, 아이패드, 윈도우 PC, 안드로이드 폰 등 어떤 기기에서든 동일한 기능을 사용하실 수 있어요. 디자이너분들이 주로 사용하시는 맥북에서도 최적화되어 있습니다."
    },
    {
      question: "영수증 OCR 인식률은 어느 정도인가요?",
      answer: "일반 영수증 기준 베타 단계의 추정치이며 지속 개선 중입니다. 자세한 수치는 릴리스 노트에서 투명하게 공개합니다."
    },
    {
      question: "데이터 보안은 어떻게 관리하나요?",
      answer: "전송·저장 암호화, 최소 권한 접근 통제, 접속 로그 기록 등 기본 보안 통제를 적용합니다. 자세한 내용은 개인정보처리방침/보안 안내에서 확인하세요."
    },
    {
      question: "세무사에게 자료를 직접 전달할 수 있나요?",
      answer: "내보내기/공유 기능을 통해 필요 자료를 전달할 수 있습니다."
    },
    {
      question: "얼리 액세스 9,900원을 구매하면, 문서 다운로드는 계속 무료인가요?",
      answer: "정식 론칭 후에도 동일 계정으로 이용 시 '홈택스 제출용 문서 무제한 다운로드' 혜택이 유지됩니다. (정책 변경 시 사전 고지)"
    }
  ];

  return (
    <section className="px-4 pt-48 pb-48 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-[1056px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground mb-6 leading-tight">
            FAQ
          </h2>
        </div>

        <div className="p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-0 border-b border-gray-200 last:border-b-0">
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed p-6 bg-gray-50">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-16 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">환불 규정</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>• 보고서 문서 다운로드 전까지는 전액 환불 가능합니다.</p>
            <p>• 전자상거래법 제17조 제2항 제5호에 따라 디지털 상품 특성상 다운로드 이후 환불은 불가합니다.</p>
            <p>• 구매 전 기능·제한사항을 반드시 확인해 주세요.</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FAQSection;