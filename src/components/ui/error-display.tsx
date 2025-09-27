import React from 'react';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ErrorDisplayProps {
  error: string | Error;
  title?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  className?: string;
  variant?: 'default' | 'network' | 'auth' | 'data';
}

const getErrorVariant = (error: string | Error): ErrorDisplayProps['variant'] => {
  const errorMessage = error instanceof Error ? error.message : error;
  
  if (errorMessage.includes('네트워크') || errorMessage.includes('연결') || errorMessage.includes('fetch')) {
    return 'network';
  }
  if (errorMessage.includes('인증') || errorMessage.includes('로그인') || errorMessage.includes('권한')) {
    return 'auth';
  }
  if (errorMessage.includes('데이터') || errorMessage.includes('조회') || errorMessage.includes('저장')) {
    return 'data';
  }
  return 'default';
};

const getErrorIcon = (variant: ErrorDisplayProps['variant']) => {
  switch (variant) {
    case 'network':
      return <WifiOff className="h-6 w-6 text-red-600" />;
    case 'auth':
      return <AlertCircle className="h-6 w-6 text-orange-600" />;
    case 'data':
      return <AlertCircle className="h-6 w-6 text-yellow-600" />;
    default:
      return <AlertCircle className="h-6 w-6 text-red-600" />;
  }
};

const getErrorTitle = (variant: ErrorDisplayProps['variant'], customTitle?: string) => {
  if (customTitle) return customTitle;
  
  switch (variant) {
    case 'network':
      return '네트워크 연결 오류';
    case 'auth':
      return '인증 오류';
    case 'data':
      return '데이터 처리 오류';
    default:
      return '오류가 발생했습니다';
  }
};

const getErrorDescription = (error: string | Error, variant: ErrorDisplayProps['variant']) => {
  const errorMessage = error instanceof Error ? error.message : error;
  
  switch (variant) {
    case 'network':
      return '인터넷 연결을 확인하고 다시 시도해주세요.';
    case 'auth':
      return '로그인이 필요하거나 권한이 없습니다. 다시 로그인해주세요.';
    case 'data':
      return '데이터를 처리하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
    default:
      return errorMessage || '예상치 못한 오류가 발생했습니다.';
  }
};

const getRetryButtonText = (variant: ErrorDisplayProps['variant']) => {
  switch (variant) {
    case 'network':
      return '다시 연결';
    case 'auth':
      return '다시 로그인';
    case 'data':
      return '다시 시도';
    default:
      return '다시 시도';
  }
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  title,
  onRetry,
  showRetry = true,
  className,
  variant
}) => {
  const errorVariant = variant || getErrorVariant(error);
  const errorTitle = getErrorTitle(errorVariant, title);
  const errorDescription = getErrorDescription(error, errorVariant);
  const retryButtonText = getRetryButtonText(errorVariant);

  return (
    <Card className={cn('border-red-200 bg-red-50', className)}>
      <CardContent className="p-6 text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          {getErrorIcon(errorVariant)}
        </div>
        <h3 className="text-lg font-semibold text-red-900 mb-2">{errorTitle}</h3>
        <p className="text-red-700 mb-4">{errorDescription}</p>
        {showRetry && onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {retryButtonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// 간단한 인라인 에러 표시 컴포넌트
export const InlineError: React.FC<{
  error: string;
  className?: string;
}> = ({ error, className }) => {
  if (!error) return null;

  return (
    <div className={cn('flex items-center gap-2 text-sm text-red-600 mt-1', className)}>
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
};

// 로딩 중 에러 표시 컴포넌트
export const LoadingError: React.FC<{
  error: string | Error;
  onRetry?: () => void;
  className?: string;
}> = ({ error, onRetry, className }) => {
  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      <div className="text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600 text-sm mb-2">
          {error instanceof Error ? error.message : error}
        </p>
        {onRetry && (
          <Button
            onClick={onRetry}
            size="sm"
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            다시 시도
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
