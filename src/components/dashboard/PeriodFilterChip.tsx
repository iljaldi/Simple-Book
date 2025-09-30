import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';
import { PeriodFilter } from '@/types/dashboard';

interface PeriodFilterChipProps {
  /** 현재 선택된 기간 */
  period: PeriodFilter;
  /** 사용자 지정 기간 (period가 '사용자 지정'일 때) */
  customPeriod?: {
    startDate: string;
    endDate: string;
  };
  /** 필터 변경 핸들러 */
  onPeriodChange: (period: PeriodFilter) => void;
  /** 필터 초기화 핸들러 */
  onClear?: () => void;
  /** 추가 클래스명 */
  className?: string;
}

/**
 * 전역 기간 필터 칩 컴포넌트
 * 상단에 표시되는 활성 필터 상태를 보여주는 칩
 */
const PeriodFilterChip: React.FC<PeriodFilterChipProps> = ({
  period,
  customPeriod,
  onPeriodChange,
  onClear,
  className = ''
}) => {
  const getDisplayText = (): string => {
    if (period === '사용자 지정' && customPeriod) {
      const startDate = new Date(customPeriod.startDate);
      const endDate = new Date(customPeriod.endDate);
      return `${startDate.getMonth() + 1}월 ${startDate.getDate()}일 - ${endDate.getMonth() + 1}월 ${endDate.getDate()}일`;
    }
    return period;
  };

  const getVariant = (): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (period === '이번 달') return 'default';
    if (period === '사용자 지정') return 'secondary';
    return 'outline';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge 
        variant={getVariant()}
        className="flex items-center gap-2 px-3 py-1"
        role="button"
        tabIndex={0}
        onClick={() => onPeriodChange(period)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPeriodChange(period);
          }
        }}
        aria-label={`현재 선택된 기간: ${getDisplayText()}. 클릭하여 변경`}
      >
        <Calendar className="h-3 w-3" />
        <span className="text-sm font-medium">{getDisplayText()}</span>
      </Badge>
      
      {onClear && period !== '이번 달' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-6 w-6 p-0"
          aria-label="필터 초기화"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default PeriodFilterChip;
