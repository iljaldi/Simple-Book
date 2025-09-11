import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
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
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* 로고 & 서비스 소개 */}
          <div className="col-span-1 md:col-span-2">
            <button 
              onClick={scrollToTop}
              className="flex items-center space-x-2 hover:opacity-80 transition-smooth mb-6"
            >
              <span className="text-xl font-bold text-white">Simple Book</span>
            </button>
            
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              1인 기업·프리랜서를 위한 가장 쉬운 장부 관리 서비스입니다.<br />
              수입·지출 입력부터 세금 보고서까지, 하루 5분 만에 끝냅니다.
            </p>
          </div>

          {/* 서비스 정보 */}
          <div>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#about" className="text-gray-300 hover:text-white transition-smooth">
                  서비스 소개
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-300 hover:text-white transition-smooth">
                  주요 기능
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-smooth">
                  요금제
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-smooth">
                  블로그
                </a>
              </li>
            </ul>
          </div>

          {/* 지원 & 정책 */}
          <div>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-smooth">
                  카카오톡 상담
                </a>
              </li>
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white transition-smooth">
                  도움말 센터
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:support@simplebook.com"
                  className="text-gray-300 hover:text-white transition-smooth"
                >
                  이메일 문의
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-smooth">
                  이용약관
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-300 transition-smooth font-bold">
                  개인정보 처리방침
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 저작권 */}
        <div className="mt-12 pt-8">
          <p className="text-sm text-gray-300">
            ⓒ 2025 Simple Book. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;