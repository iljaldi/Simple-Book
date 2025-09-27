import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import TermsModal from "./TermsModal";
import PrivacyModal from "./PrivacyModal";

const Footer = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const scrollToTop = () => {
    const heroElement = document.getElementById('hero');
    if (heroElement) {
      heroElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-8 lg:space-y-0">
          {/* 로고 & 서비스 소개 */}
          <div className="flex-1 lg:max-w-md">
            <button 
              onClick={scrollToTop}
              className="flex items-center space-x-2 hover:opacity-80 transition-smooth mb-4 sm:mb-6"
            >
              <span className="text-lg sm:text-xl font-bold text-white">Simple Book</span>
            </button>
            
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
              1인 기업·프리랜서 디자이너를 위한 가장 쉬운 장부 관리 서비스입니다.<br />
              수입·지출 입력부터 세금 보고서까지, 하루 5분 만에 끝냅니다.
            </p>
          </div>

          {/* 회사 정보 */}
          <div className="lg:mx-8">
            <div className="text-xs sm:text-sm text-gray-300 space-y-1">
              <p>상호명 : 일잘디.랩</p>
              <p>대표자명 : 이지은</p>
              <p>사업자등록번호: 556-30-01800</p>
              <p className="break-all">통신판매업신고번호 : 제 2025-서울마포-2307 호</p>
              <p className="break-words">주소 : 서울특별시 마포구 양화로3길 77-13 101호</p>
            </div>
          </div>

          {/* 지원 & 정책 */}
          <div>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li className="relative">
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-smooth"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTooltip(true);
                    setTimeout(() => setShowTooltip(false), 2000);
                  }}
                >
                  카카오톡 상담
                </a>
                {showTooltip && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
                    준비 중입니다
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                )}
              </li>
              <li>
                <a 
                  href="mailto:homer79@naver.com"
                  className="text-gray-300 hover:text-white transition-smooth"
                >
                  이메일 문의
                </a>
              </li>
              <li>
                <button 
                  onClick={() => setIsTermsModalOpen(true)}
                  className="text-gray-300 hover:text-white transition-smooth"
                >
                  이용약관
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="text-white hover:text-gray-300 transition-smooth font-bold"
                >
                  개인정보 처리방침
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* 저작권 */}
        <div className="mt-8 pt-4">
          <p className="text-sm text-gray-300">
            ⓒ 2025 Simple Book. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* 모달들 */}
      <TermsModal 
        isOpen={isTermsModalOpen} 
        onClose={() => setIsTermsModalOpen(false)} 
      />
      <PrivacyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />
    </footer>
  );
};

export default Footer;