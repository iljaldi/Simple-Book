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
      question: "세무사에게 자료를 직접 전달할 수 있나요?",
      answer: "네, 세무사 계정 공유 기능을 제공합니다. 세무사님께 초대 링크를 보내면 실시간으로 장부 데이터를 확인하고 상담을 받으실 수 있습니다. 또한 필요한 보고서를 PDF로 다운받아 이메일로 전달하는 것도 가능해요."
    },
    {
      question: "베타 서비스 기간 동안 정말 무료인가요?",
      answer: "네, 베타 서비스 기간 동안은 모든 기능을 완전히 무료로 사용하실 수 있습니다. 기간 제한도 없고, 광고도 없으며, 모든 핵심 기능을 제한 없이 체험해보실 수 있어요. 베타 기간이 끝나면 유료 전환 여부를 선택하실 수 있습니다."
    },
    {
      question: "맥북이나 아이폰에서도 사용할 수 있나요?",
      answer: "네, 모든 디바이스에서 사용 가능합니다. 웹 기반 서비스로 맥북, 아이폰, 아이패드, 윈도우 PC, 안드로이드 폰 등 어떤 기기에서든 동일한 기능을 사용하실 수 있어요. 디자이너분들이 주로 사용하시는 맥북에서도 최적화되어 있습니다."
    },
    {
      question: "데이터 보안은 안전한가요?",
      answer: "네, Simple Book은 금융보안원의 보안 인증을 받았으며, 모든 데이터는 암호화되어 저장됩니다. 또한 사용자가 원하면 언제든지 모든 데이터를 완전히 삭제할 수 있습니다. 개인정보보호법을 철저히 준수하고 있어요."
    },
    {
      question: "영수증 OCR 인식률은 어느 정도인가요?",
      answer: "일반적인 매장 영수증의 경우 95% 이상의 높은 인식률을 보여드리고 있습니다. 디자이너분들이 자주 사용하시는 카페, 식당, 교통비, 소프트웨어 구매 영수증 등도 정확하게 인식합니다. 만약 인식이 잘못된 경우에도 쉽게 수정할 수 있어요."
    }
  ];

  return (
    <section className="px-4 pt-48 pb-48 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-[1056px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground mb-6 leading-tight">
            자주 묻는 질문
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

      </div>
    </section>
  );
};

export default FAQSection;