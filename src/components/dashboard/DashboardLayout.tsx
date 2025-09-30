import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * 대시보드 3영역 레이아웃 컴포넌트
 * - 요약 영역 (Summary)
 * - 작업 영역 (Tasks) 
 * - 인사이트/일정 영역 (Insights)
 * 
 * CTA 전역 스티키 노출 정책:
 * - 노출 화면: 대시보드, 거래 내역 리스트, 영수증함, 리포트(분석), 신고 개요/히스토리
 * - 숨김 화면: 거래입력 폼, 영수증 촬영/업로드 플로우, 온보딩/튜토리얼, 결제·보안 관련 민감 화면, 모달/바텀시트 활성 중
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 전역 필터 영역 */}
      <nav 
        className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8"
        aria-label="대시보드 필터 및 네비게이션"
      >
        <div className="max-w-7xl mx-auto py-4">
          {/* TODO: 기간 필터, 장부/프로젝트 선택 컴포넌트 구현 */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
            <div className="flex items-center gap-4">
              {/* TODO: 기간 필터 드롭다운 */}
              <div className="text-sm text-gray-500">기간 필터 (구현 예정)</div>
              {/* TODO: 장부/프로젝트 선택 */}
              <div className="text-sm text-gray-500">장부 선택 (구현 예정)</div>
            </div>
          </div>
        </div>
      </nav>

      {/* 본문 3영역 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 요약 영역 */}
          <section 
            className="lg:col-span-1"
            aria-label="요약 정보"
          >
            <div className="space-y-6">
              {children}
            </div>
          </section>

          {/* 작업 영역 */}
          <section 
            className="lg:col-span-1"
            aria-label="할 일 및 작업 목록"
          >
            <div className="space-y-6">
              {/* TODO: 작업 영역 위젯들 */}
            </div>
          </section>

          {/* 인사이트/일정 영역 */}
          <section 
            className="lg:col-span-1"
            aria-label="인사이트 및 일정"
          >
            <div className="space-y-6">
              {/* TODO: 인사이트 영역 위젯들 */}
            </div>
          </section>
        </div>
      </main>

      {/* 
        전역 스티키 CTA 노출 정책 (CTA PRD 6장 기준):
        
        ✅ 노출 화면 (현재 페이지):
        - 대시보드 (현재) - 노출
        - 거래 내역 리스트 - 노출
        - 영수증함 - 노출  
        - 리포트(분석) - 노출
        - 신고 개요/히스토리 - 노출
        
        ❌ 숨김 화면:
        - 거래입력 폼 (/transactions/add, /transactions/edit/*) - 숨김
        - 영수증 촬영/업로드 플로우 (/receipts/upload) - 숨김
        - 온보딩/튜토리얼 - 숨김
        - 결제·보안 관련 민감 화면 - 숨김
        - 모달/바텀시트 활성 중 - 숨김
        
        🔄 상태 기반 축소 (CTA PRD 6장):
        - 스크롤 다운 시 자동 축소 (아이콘만) → 상황 종료 시 재등장
        - 키보드 활성 시 자동 축소 → 키보드 비활성 시 재등장
        - 화면 내 다른 고정 요소 등장 시 자동 축소 → 요소 사라지면 재등장
        
        📱 Self 페이지 숨김 플래그 전달 방법:
        1. 라우트 기반 감지: useLocation()으로 현재 경로 확인
        2. 숨김 경로 패턴 매칭:
           - /transactions/add, /transactions/edit/*
           - /receipts/upload, /receipts/capture
           - /onboarding/*, /tutorial/*
           - /payment/*, /security/*
        3. 모달 상태 감지: 전역 모달 상태 관리 (Context/Store)
        4. 키보드 상태 감지: document.activeElement 타입 확인
        5. 스크롤 상태 감지: window.scrollY > 100 (임계값)
        
        🎯 구현 예시:
        const shouldShowCTA = useMemo(() => {
          const path = location.pathname;
          const isHiddenRoute = /^\/(transactions\/(add|edit\/)|receipts\/(upload|capture)|onboarding|tutorial|payment|security)/.test(path);
          const isModalOpen = modalState.isOpen;
          const isKeyboardActive = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';
          const isScrolled = window.scrollY > 100;
          
          return !isHiddenRoute && !isModalOpen && !isKeyboardActive && !isScrolled;
        }, [location.pathname, modalState.isOpen]);
      */}
    </div>
  );
};

export default DashboardLayout;
