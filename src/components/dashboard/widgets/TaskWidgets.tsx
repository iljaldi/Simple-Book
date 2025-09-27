import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, FileText, Receipt, Settings } from 'lucide-react';
import { UnclassifiedViewModel } from '@/types/dashboard';
import { analytics } from '@/lib/analytics';

/**
 * 작업 영역 위젯들
 * - 미분류/미증빙 위젯
 * - 이번 주 할 일 위젯
 * - 정기구독 경고 위젯
 */

interface UnclassifiedWidgetProps {
  /** 미분류/미증빙 데이터 */
  data: UnclassifiedViewModel;
  /** 현재 필터 상태 */
  filterState: {
    period: string;
    projectId?: string;
  };
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 규칙 만들기 핸들러 */
  onRuleCreate?: () => void;
}

// 미분류/미증빙 위젯
export const UnclassifiedWidget: React.FC<UnclassifiedWidgetProps> = ({ 
  data, 
  filterState, 
  onClick,
  onRuleCreate 
}) => {
  const handleClick = () => {
    // Analytics 이벤트 추적
    analytics.trackTodoQuickAction('unclassified', 'click');
    analytics.trackWidgetClicked('unclassified', filterState.period, filterState.projectId);
    
    // TODO: 실제 라우팅 구현
    if (onClick) {
      onClick();
    } else {
      console.log('영수증함 페이지로 이동 (미분류/미증빙 필터):', filterState);
    }
  };

  const handleRuleCreate = () => {
    // Analytics 이벤트 추적
    analytics.trackTodoQuickAction('unproven', 'click');
    
    // TODO: 실제 규칙 만들기 모달/페이지로 이동
    if (onRuleCreate) {
      onRuleCreate();
    } else {
      console.log('규칙 만들기 모달 열기');
    }
  };

  const getUrgencyLevel = (): 'low' | 'medium' | 'high' => {
    if (data.totalPendingCount === 0) return 'low';
    if (data.totalPendingCount <= 5) return 'medium';
    return 'high';
  };

  const getUrgencyColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'border-green-200 bg-green-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'high': return 'border-red-200 bg-red-50';
    }
  };

  const getUrgencyTextColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'text-green-900';
      case 'medium': return 'text-yellow-900';
      case 'high': return 'text-red-900';
    }
  };

  const urgencyLevel = getUrgencyLevel();

  return (
    <Card className={`border ${getUrgencyColor(urgencyLevel)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-lg font-semibold ${getUrgencyTextColor(urgencyLevel)}`}>
            미분류 / 미증빙
          </CardTitle>
          {data.hasRepeatingPattern && (
            <Badge 
              variant="secondary" 
              className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
              onClick={handleRuleCreate}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleRuleCreate();
                }
              }}
              aria-label="반복 패턴 발견. 규칙 만들기 클릭"
            >
              <Settings className="h-3 w-3 mr-1" />
              규칙 만들기
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 건수 표시 */}
          <div className="text-center">
            <div className={`text-2xl font-bold ${getUrgencyTextColor(urgencyLevel)} mb-2`}>
              미분류 {data.unclassifiedCount}건 / 미증빙 {data.unreceiptedCount}건
            </div>
            <div className={`text-sm ${getUrgencyTextColor(urgencyLevel)} opacity-80 mb-4`}>
              {data.totalPendingCount === 0 
                ? '정리할 거래가 없습니다' 
                : '마감 실패의 주범을 한 번에 처리하세요'
              }
            </div>
          </div>

          {/* 아이콘 표시 */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">미분류</span>
            </div>
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">미증빙</span>
            </div>
          </div>

          {/* 긴급도 표시 */}
          {urgencyLevel === 'high' && (
            <div className="flex items-center gap-2 p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700 font-medium">
                처리 필요 건수가 많습니다. 우선순위를 정해 처리하세요.
              </span>
            </div>
          )}

          {/* 액션 버튼 */}
          <Button 
            onClick={handleClick}
            className={`w-full ${
              urgencyLevel === 'high' 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : urgencyLevel === 'medium'
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            aria-label={`${data.actionButtonText}. 미분류 ${data.unclassifiedCount}건, 미증빙 ${data.unreceiptedCount}건`}
          >
            {data.actionButtonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// 이번 주 할 일 위젯
export const WeeklyTasksWidget: React.FC = () => {
  return (
    <Card className="border border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          이번 주 할 일
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO: 영수증 정리 건수, 월마감 D-Day, 부가세/종소세 준비 알림, 예정 구독 구현 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">영수증 정리</span>
            <span className="text-sm font-medium text-gray-900">0건</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">월마감 D-Day</span>
            <span className="text-sm font-medium text-orange-600">D-15</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">부가세 준비</span>
            <span className="text-sm font-medium text-yellow-600">준비 중</span>
          </div>
        </div>
        {/* TODO: 각 항목 우측에 바로가기 링크, 체크 완료 기록 구현 */}
      </CardContent>
    </Card>
  );
};

// 정기구독 경고 위젯
export const SubscriptionAlertWidget: React.FC = () => {
  return (
    <Card className="border border-orange-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          정기구독 경고
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO: 14일 내 결제 예정 항목 리스트 구현 */}
        <div className="text-center py-6">
          <div className="text-sm text-gray-500 mb-2">
            14일 내 결제 예정 항목
          </div>
          <div className="text-lg font-medium text-orange-600">
            구독 항목 없음
          </div>
        </div>
        {/* TODO: 항목별 메모(해지/보류/협상 예정), 상세 보기 연결 구현 */}
        <button className="w-full text-sm text-orange-600 hover:text-orange-700">
          구독 관리 →
        </button>
      </CardContent>
    </Card>
  );
};
