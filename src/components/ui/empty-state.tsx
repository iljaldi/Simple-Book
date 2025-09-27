import React from 'react';
import { cn } from '@/lib/utils';
import { Circle, Plus, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  variant?: 'default' | 'transaction' | 'chart' | 'receipt';
}

const getDefaultIcon = (variant: EmptyStateProps['variant']) => {
  switch (variant) {
    case 'transaction':
      return <FileText className="h-12 w-12 text-gray-300" />;
    case 'chart':
      return <BarChart3 className="h-12 w-12 text-gray-300" />;
    case 'receipt':
      return <FileText className="h-12 w-12 text-gray-300" />;
    default:
      return <Circle className="h-12 w-12 text-gray-300" />;
  }
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
  variant = 'default'
}) => {
  const displayIcon = icon || getDefaultIcon(variant);

  return (
    <div className={cn('text-center py-8', className)}>
      <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center">
        {displayIcon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-4 max-w-sm mx-auto">{description}</p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-black hover:bg-gray-800 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      )}
    </div>
  );
};

// 특화된 빈 상태 컴포넌트들
export const EmptyTransactions: React.FC<{
  onAddTransaction?: () => void;
  className?: string;
}> = ({ onAddTransaction, className }) => (
  <EmptyState
    variant="transaction"
    title="거래 내역이 없습니다"
    description="첫 번째 거래를 추가하여 장부 관리를 시작해보세요."
    action={onAddTransaction ? {
      label: "거래 추가",
      onClick: onAddTransaction
    } : undefined}
    className={className}
  />
);

export const EmptyFixedExpenses: React.FC<{
  onAddExpense?: () => void;
  className?: string;
}> = ({ onAddExpense, className }) => (
  <EmptyState
    variant="receipt"
    title="고정 지출이 없습니다"
    description="정기적으로 발생하는 지출을 등록하여 자동으로 관리하세요."
    action={onAddExpense ? {
      label: "고정 지출 추가",
      onClick: onAddExpense
    } : undefined}
    className={className}
  />
);

export const EmptyChart: React.FC<{
  className?: string;
}> = ({ className }) => (
  <EmptyState
    variant="chart"
    title="차트 데이터가 없습니다"
    description="거래 내역을 추가하면 차트가 표시됩니다."
    className={className}
  />
);

export default EmptyState;
