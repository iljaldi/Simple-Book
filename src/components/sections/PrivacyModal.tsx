import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal = ({ isOpen, onClose }: PrivacyModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl sm:rounded-2xl max-w-xs sm:max-w-lg md:max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">개인정보 처리방침</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 sm:p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2">제1조 (개인정보의 처리목적)</h3>
              <p>일잘디.랩(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
              <p className="mt-2">1. 서비스 제공: 간편장부 관리 서비스 제공</p>
              <p>2. 회원 관리: 회원 식별, 가입의사 확인, 본인확인, 회원자격 유지·관리</p>
              <p>3. 고객상담: 문의사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">제2조 (개인정보의 처리 및 보유기간)</h3>
              <p>1. 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의받은 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
              <p>2. 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:</p>
              <p className="ml-4">- 회원가입 및 관리: 회원 탈퇴시까지</p>
              <p className="ml-4">- 서비스 제공: 서비스 이용 종료시까지</p>
              <p className="ml-4">- 고객상담: 상담 완료 후 3년</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">제3조 (처리하는 개인정보의 항목)</h3>
              <p>회사는 다음의 개인정보 항목을 처리하고 있습니다:</p>
              <p className="mt-2">1. 회원가입 및 관리:</p>
              <p className="ml-4">- 필수항목: 이메일, 비밀번호, 이름</p>
              <p className="ml-4">- 선택항목: 연락처, 주소</p>
              <p>2. 서비스 이용 과정에서 자동 수집되는 정보:</p>
              <p className="ml-4">- IP주소, 쿠키, MAC주소, 서비스 이용기록, 방문기록, 불량 이용기록 등</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">제4조 (개인정보의 제3자 제공)</h3>
              <p>1. 회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
              <p>2. 회사는 다음과 같이 개인정보를 제3자에게 제공하고 있습니다:</p>
              <p className="ml-4">- 제공받는 자: 없음 (현재 제3자 제공 없음)</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">제5조 (개인정보처리의 위탁)</h3>
              <p>1. 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
              <p className="ml-4">- 위탁받는 자: Amazon Web Services (AWS)</p>
              <p className="ml-4">- 위탁하는 업무의 내용: 클라우드 서버 운영 및 데이터 저장</p>
              <p>2. 회사는 위탁계약 체결시 개인정보보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">제6조 (정보주체의 권리·의무 및 행사방법)</h3>
              <p>1. 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
              <p className="ml-4">- 개인정보 처리현황 통지요구</p>
              <p className="ml-4">- 오류 등이 있을 경우 정정·삭제 요구</p>
              <p className="ml-4">- 처리정지 요구</p>
              <p>2. 제1항에 따른 권리 행사는 회사에 대해 서면, 전화, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다.</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">제7조 (개인정보의 파기)</h3>
              <p>1. 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
              <p>2. 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.</p>
              <p>3. 개인정보 파기의 절차 및 방법은 다음과 같습니다:</p>
              <p className="ml-4">- 파기절차: 회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.</p>
              <p className="ml-4">- 파기방법: 회사는 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 로우레벨포맷(Low Level Format) 등의 방법을 이용하여 파기하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">제8조 (개인정보의 안전성 확보조치)</h3>
              <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
              <p className="mt-2">1. 관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등</p>
              <p>2. 기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 개인정보의 암호화, 보안프로그램 설치</p>
              <p>3. 물리적 조치: 전산실, 자료보관실 등의 접근통제</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">제9조 (개인정보 보호책임자)</h3>
              <p>1. 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:</p>
              <p className="mt-2">개인정보 보호책임자</p>
              <p className="ml-4">- 성명: 이지은</p>
              <p className="ml-4">- 연락처: homer79@naver.com</p>
              <p>2. 정보주체께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다.</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">제10조 (권익침해 구제방법)</h3>
              <p>정보주체는 아래의 기관에 대해 개인정보 침해신고를 할 수 있습니다:</p>
              <p className="mt-2">1. 개인정보보호위원회 (privacy.go.kr / 국번없이 182)</p>
              <p>2. 대검찰청 사이버범죄수사단 (www.spo.go.kr / 02-3480-3571)</p>
              <p>3. 경찰청 사이버안전국 (cyberbureau.police.go.kr / 국번없이 182)</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">제11조 (개인정보 처리방침의 변경)</h3>
              <p>1. 이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
            </div>

            <div className="mt-8 pt-4 border-t">
              <p className="text-xs text-gray-500">
                본 방침은 2025년 1월 1일부터 시행됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
