import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Camera, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * 전역 스티키 CTA 컴포넌트
 * - FAB + 스피드 다이얼 형태
 * - 새 거래 입력, 영수증 촬영 액션
 * - 특정 페이지에서는 숨김 처리
 * 
 * CTA PRD 6장 노출/숨김 규칙:
 * ✅ 노출: 대시보드, 거래 내역 리스트, 영수증함, 리포트(분석), 신고 개요/히스토리
 * ❌ 숨김: 거래입력 폼, 영수증 촬영/업로드 플로우, 온보딩/튜토리얼, 결제·보안 관련 민감 화면, 모달/바텀시트 활성 중
 * 🔄 상태 기반 축소: 스크롤 다운, 키보드 활성, 화면 내 다른 고정 요소 등장 시 자동 축소
 */
const GlobalStickyCTA: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // CTA PRD 6장: 숨김 화면 감지
  const shouldHideCTA = useMemo(() => {
    const path = location.pathname;
    const hiddenRoutes = [
      /^\/transactions\/(add|edit\/)/,  // 거래입력 폼
      /^\/receipts\/(upload|capture)/,  // 영수증 촬영/업로드 플로우
      /^\/onboarding/,                  // 온보딩
      /^\/tutorial/,                    // 튜토리얼
      /^\/payment/,                     // 결제 관련
      /^\/security/                     // 보안 관련
    ];
    
    return hiddenRoutes.some(route => route.test(path));
  }, [location.pathname]);

  // CTA PRD 6장: 상태 기반 축소 감지
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsScrolled(scrolled);
    };

    const handleFocus = () => {
      const activeElement = document.activeElement;
      const isInputFocused = activeElement?.tagName === 'INPUT' || 
                           activeElement?.tagName === 'TEXTAREA' ||
                           activeElement?.contentEditable === 'true';
      setIsKeyboardActive(isInputFocused);
    };

    const handleBlur = () => {
      // 약간의 지연을 두어 다른 입력 요소로 포커스 이동 시에도 감지
      setTimeout(() => {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement?.tagName === 'INPUT' || 
                             activeElement?.tagName === 'TEXTAREA' ||
                             activeElement?.contentEditable === 'true';
        setIsKeyboardActive(isInputFocused);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  // CTA PRD 6장: 자동 축소 로직
  useEffect(() => {
    const shouldMinimize = isScrolled || isKeyboardActive;
    setIsMinimized(shouldMinimize);
    
    // 축소 시 열린 다이얼도 닫기
    if (shouldMinimize && isOpen) {
      setIsOpen(false);
    }
  }, [isScrolled, isKeyboardActive, isOpen]);

  // CTA PRD 6장: Self 페이지에서 완전 숨김
  if (shouldHideCTA) {
    return null;
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNewTransaction = () => {
    // TODO: 새 거래 입력 페이지로 이동 (필터/프로젝트 컨텍스트 유지)
    console.log('새 거래 입력 시작');
    setIsOpen(false);
  };

  const handleReceiptCapture = () => {
    // TODO: 영수증 촬영/업로드 페이지로 이동
    console.log('영수증 촬영 시작');
    setIsOpen(false);
  };

  return (
    <>
      {/* CTA PRD 7장: 스피드 다이얼 배경 오버레이 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          aria-hidden="true"
        />
      )}

      {/* CTA PRD 5장: 메인 FAB - 화면 하단 고정 */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isMinimized ? 'scale-75 opacity-60' : 'scale-100 opacity-100'
      }`}>
        <Button
          onClick={handleToggle}
          className="w-14 h-14 rounded-full bg-black hover:bg-gray-800 text-white shadow-lg transition-transform hover:scale-105"
          aria-label="빠른 추가"
          disabled={isMinimized}
        >
          <Plus className={`h-6 w-6 transition-transform ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
        </Button>

        {/* CTA PRD 7장: 스피드 다이얼 옵션들 - 위로 펼쳐짐 */}
        {isOpen && !isMinimized && (
          <div className="absolute bottom-16 right-0 space-y-3 animate-in slide-in-from-bottom-2 duration-200">
            {/* CTA PRD 5장: 새 거래 옵션 */}
            <Button
              onClick={handleNewTransaction}
              className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
              aria-label="새 거래 입력"
            >
              <FileText className="h-5 w-5" />
            </Button>

            {/* CTA PRD 5장: 영수증 촬영 옵션 */}
            <Button
              onClick={handleReceiptCapture}
              className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
              aria-label="영수증 촬영"
            >
              <Camera className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default GlobalStickyCTA;
