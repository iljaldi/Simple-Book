import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PeriodFilterChip from '@/components/dashboard/PeriodFilterChip';
import { NetProfitWidget, EstimatedTaxWidget } from '@/components/dashboard/widgets/SummaryWidgets';
import { UnclassifiedWidget, WeeklyTasksWidget, SubscriptionAlertWidget } from '@/components/dashboard/widgets/TaskWidgets';
import { CashFlowWidget, TopExpenseCategoriesWidget, TaxCalendarWidget } from '@/components/dashboard/widgets/InsightWidgets';
import GlobalStickyCTA from '@/components/dashboard/GlobalStickyCTA';
import { DashboardViewModel, PeriodFilter } from '@/types/dashboard';
import { scenarios, createScenario } from '@/fixtures/dashboard';
import { analytics } from '@/lib/analytics';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardViewModel | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState<PeriodFilter>('이번 달');
  const [isLoading, setIsLoading] = useState(true);

  // 대시보드 데이터 로드
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // TODO: 실제 API 호출로 교체
        // const response = await fetchDashboardData(currentPeriod);
        // setDashboardData(response);
        
        // 현재는 픽스처 데이터 사용
        const scenario = createScenario('general');
        const data = scenario.createNormalUserScenario(currentPeriod);
        setDashboardData(data);
        
        // Analytics 이벤트 추적
        analytics.trackDashboardViewed(currentPeriod, data.filter.projectId, 'freelancer');
        
      } catch (error) {
        console.error('대시보드 데이터 로드 실패:', error);
        // 에러 시 빈 데이터로 폴백
        const emptyData = scenarios.newUser();
        setDashboardData(emptyData);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [currentPeriod]);

  // 기간 필터 변경 핸들러
  const handlePeriodChange = (period: PeriodFilter) => {
    setCurrentPeriod(period);
  };

  // 필터 초기화 핸들러
  const handleClearFilter = () => {
    setCurrentPeriod('이번 달');
  };

  // 위젯 클릭 핸들러들
  const handleNetProfitClick = () => {
    // TODO: 실제 라우팅 구현
    console.log('거래내역 페이지로 이동:', { period: currentPeriod });
    navigate('/transactions', { 
      state: { filter: { period: currentPeriod } } 
    });
  };

  const handleUnclassifiedClick = () => {
    // TODO: 실제 라우팅 구현
    console.log('영수증함 페이지로 이동 (미분류/미증빙 필터):', { period: currentPeriod });
    navigate('/receipts', { 
      state: { filter: { period: currentPeriod, status: 'unclassified' } } 
    });
  };

  const handleRuleCreate = () => {
    // TODO: 실제 규칙 만들기 모달/페이지로 이동
    console.log('규칙 만들기 모달 열기');
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">대시보드 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>대시보드 - 간편장부 | 프리랜서 1인사업자 장부관리</title>
        <meta name="description" content="프리랜서와 1인사업자를 위한 간편장부 대시보드. 수입·지출 현황을 한눈에 확인하고 월별 추세를 분석하세요. 무료로 시작하세요!" />
        <meta name="keywords" content="대시보드, 장부관리, 수입지출, 프리랜서, 1인사업자, 간편장부, 월별분석, 재무관리" />
        <meta property="og:title" content="대시보드 - 간편장부 | 프리랜서 1인사업자 장부관리" />
        <meta property="og:description" content="프리랜서와 1인사업자를 위한 간편장부 대시보드. 수입·지출 현황을 한눈에 확인하고 월별 추세를 분석하세요." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://simplebook.site/dashboard" />
      </Helmet>
      
      <DashboardLayout>
        {/* 상단 필터 영역 */}
        <div className="mb-6">
          <PeriodFilterChip
            period={currentPeriod}
            customPeriod={dashboardData.filter.customPeriod}
            onPeriodChange={handlePeriodChange}
            onClear={currentPeriod !== '이번 달' ? handleClearFilter : undefined}
          />
        </div>

        {/* 요약 영역 위젯들 */}
        <NetProfitWidget 
          data={dashboardData.summary.netProfit}
          filterState={{
            period: currentPeriod,
            projectId: dashboardData.filter.projectId
          }}
          onClick={handleNetProfitClick}
        />
        <EstimatedTaxWidget />
        
        {/* 작업 영역 위젯들 */}
        <UnclassifiedWidget 
          data={dashboardData.tasks.unclassified}
          filterState={{
            period: currentPeriod,
            projectId: dashboardData.filter.projectId
          }}
          onClick={handleUnclassifiedClick}
          onRuleCreate={handleRuleCreate}
        />
        <WeeklyTasksWidget />
        <SubscriptionAlertWidget />
        
        {/* 인사이트/일정 영역 위젯들 */}
        <CashFlowWidget />
        <TopExpenseCategoriesWidget />
        <TaxCalendarWidget />
      </DashboardLayout>
      
      {/* 전역 스티키 CTA */}
      <GlobalStickyCTA />
    </>
  );
};

export default Dashboard;