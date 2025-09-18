import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn(
      'animate-spin rounded-full border-b-2 border-black',
      sizeClasses[size],
      className
    )} />
  );
};

interface LoadingPageProps {
  message?: string;
  description?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ 
  message = '로딩 중...',
  description 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600 text-lg font-medium">{message}</p>
        {description && (
          <p className="text-sm text-gray-500 mt-2">{description}</p>
        )}
      </div>
    </div>
  );
};

interface LoadingCardProps {
  message?: string;
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ 
  message = '로딩 중...',
  className 
}) => {
  return (
    <div className={cn(
      'flex items-center justify-center p-8',
      className
    )}>
      <div className="text-center">
        <LoadingSpinner className="mx-auto mb-2" />
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  );
};
