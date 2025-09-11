import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value, 
    max = 100, 
    variant = 'default',
    size = 'medium',
    showLabel = false,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variants = {
      default: 'bg-[var(--color-brand-bg)]',
      success: 'bg-[var(--color-green)]',
      warning: 'bg-[var(--color-yellow)]',
      error: 'bg-[var(--color-red)]'
    };

    const sizes = {
      small: 'h-1',
      medium: 'h-2',
      large: 'h-3'
    };

    return (
      <div className="w-full">
        {showLabel && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-[var(--text-small)] text-[var(--color-text-primary)]">
              Progress
            </span>
            <span className="text-[var(--text-small)] text-[var(--color-text-secondary)]">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        <div
          ref={ref}
          className={cn(
            'w-full bg-[var(--color-bg-tertiary)] rounded-[var(--radius-rounded)] overflow-hidden',
            sizes[size],
            className
          )}
          {...props}
        >
          <div
            className={cn(
              'h-full transition-all duration-300 ease-out',
              variants[variant]
            )}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
