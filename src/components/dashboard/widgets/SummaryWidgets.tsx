import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { NetProfitViewModel } from '@/types/dashboard';
import { analytics } from '@/lib/analytics';

/**
 * 요약 영역 위젯들
 * - 순이익 위젯
 * - 예상세액 위젯
 */

interface NetProfitWidgetProps {
  /** 순이익 데이터 */
  data: NetProfitViewModel;
  /** 현재 필터 상태 */
  filterState: {
    period: string;
    projectId?: string;
  };
  /** 클릭 핸들러 */
  onClick?: () => void;
}

// 순이익 위젯
export const NetProfitWidget: React.FC<NetProfitWidgetProps> = ({ 
  data, 
  filterState, 
  onClick 
}) => {
  const handleClick = () => {
    // Analytics 이벤트 추적
    analytics.trackWidgetClicked('net_profit', filterState.period, filterState.projectId);
    
    // TODO: 실제 라우팅 구현
    if (onClick) {
      onClick();
    } else {
      console.log('거래내역 페이지로 이동 (필터 유지):', filterState);
    }
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (percentage: number): string => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return null;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  if (data.isEmpty) {
    return (
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">
            이번 달 순이익
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <Plus className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-gray-500 mb-4">{data.emptyMessage}</p>
            <Button 
              onClick={handleClick}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              aria-label="첫 거래 추가하기"
            >
              {data.actionButtonText}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          이번 달 순이익
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 순이익 수치 */}
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {formatAmount(data.netProfit.net)}
            </div>
            <div className="text-sm text-gray-500 mb-2">
              이번 달 남은 돈
            </div>
          </div>

          {/* 전월 대비 변화율 */}
          <div className="flex items-center justify-center gap-2">
            {getTrendIcon(data.monthOverMonthChange)}
            <span className={`text-sm font-medium ${getTrendColor(data.monthOverMonthChange)}`}>
              {formatPercentage(data.monthOverMonthChange)}
            </span>
            <span className="text-sm text-gray-500">전월 대비</span>
          </div>

          {/* 스파크라인 차트 영역 */}
          <div className="h-16 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-xs text-gray-400">
              스파크라인 차트 (구현 예정)
            </div>
          </div>

          {/* 액션 버튼 */}
          <Button 
            variant="outline" 
            onClick={handleClick}
            className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            aria-label={`${data.actionButtonText}. 현재 기간: ${filterState.period}`}
          >
            {data.actionButtonText} →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// 예상세액 위젯
export const EstimatedTaxWidget: React.FC = () => {
  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          예상세액 (참고용)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO: 부가세/종소세 추정치, 사용자 사업 유형 안내 구현 */}
        <div className="text-center py-8">
          <div className="text-2xl font-bold text-yellow-600 mb-2">
            ₩0
          </div>
          <div className="text-sm text-gray-500 mb-4">
            부가세 + 소득세 추정
          </div>
          <div className="text-xs text-yellow-500 bg-yellow-50 p-2 rounded">
            ⚠️ 참고용입니다. 정확한 세액은 세무사와 상담하세요.
          </div>
        </div>
        {/* TODO: 자세히 보기 → 신고 메뉴 시뮬레이션 연결 */}
        <button className="w-full text-sm text-yellow-600 hover:text-yellow-700">
          자세히 보기 →
        </button>
      </CardContent>
    </Card>
  );
};
