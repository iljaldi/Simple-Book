import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: [
        'bg-[var(--color-bg-secondary)]',
        'border border-[var(--color-border-primary)]'
      ],
      elevated: [
        'bg-[var(--color-bg-secondary)]',
        'shadow-[var(--shadow-medium)]',
        'border border-[var(--color-border-primary)]'
      ],
      outlined: [
        'bg-transparent',
        'border-2 border-[var(--color-border-primary)]'
      ]
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[var(--radius-12)] p-6',
          'transition-all duration-200',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
