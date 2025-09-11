import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'medium', children, ...props }, ref) => {
    const baseStyles = [
      'inline-flex items-center justify-center',
      'font-medium rounded-full',
      'transition-colors duration-200'
    ];

    const variants = {
      default: [
        'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]',
        'border border-[var(--color-border-primary)]'
      ],
      success: [
        'bg-[var(--color-green)] text-white',
        'border border-[var(--color-green)]'
      ],
      warning: [
        'bg-[var(--color-yellow)] text-black',
        'border border-[var(--color-yellow)]'
      ],
      error: [
        'bg-[var(--color-red)] text-white',
        'border border-[var(--color-red)]'
      ],
      info: [
        'bg-[var(--color-blue)] text-white',
        'border border-[var(--color-blue)]'
      ]
    };

    const sizes = {
      small: [
        'px-2 py-0.5',
        'text-[var(--text-micro)]'
      ],
      medium: [
        'px-2.5 py-1',
        'text-[var(--text-small)]'
      ],
      large: [
        'px-3 py-1.5',
        'text-[var(--text-regular)]'
      ]
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
