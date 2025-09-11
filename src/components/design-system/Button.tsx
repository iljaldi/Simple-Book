import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'medium', 
    loading = false,
    disabled,
    children, 
    ...props 
  }, ref) => {
    const baseStyles = [
      'inline-flex items-center justify-center',
      'font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-95'
    ];

    const variants = {
      primary: [
        'bg-[var(--color-brand-bg)] text-[var(--color-brand-text)]',
        'hover:bg-[var(--color-accent)]',
        'focus:ring-[var(--color-brand-bg)]',
        'shadow-sm'
      ],
      secondary: [
        'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]',
        'hover:bg-[var(--color-bg-tertiary)]',
        'focus:ring-[var(--color-bg-secondary)]',
        'border border-[var(--color-border-primary)]'
      ],
      outline: [
        'border border-[var(--color-border-primary)] text-[var(--color-text-primary)]',
        'hover:bg-[var(--color-bg-secondary)]',
        'focus:ring-[var(--color-border-primary)]',
        'bg-transparent'
      ],
      ghost: [
        'text-[var(--color-text-primary)]',
        'hover:bg-[var(--color-bg-secondary)]',
        'focus:ring-[var(--color-bg-secondary)]',
        'bg-transparent'
      ],
      destructive: [
        'bg-[var(--color-red)] text-white',
        'hover:bg-red-600',
        'focus:ring-[var(--color-red)]',
        'shadow-sm'
      ]
    };

    const sizes = {
      small: [
        'px-3 py-1.5',
        'text-[var(--text-small)]',
        'rounded-[var(--radius-6)]'
      ],
      medium: [
        'px-4 py-2',
        'text-[var(--text-regular)]',
        'rounded-[var(--radius-8)]'
      ],
      large: [
        'px-6 py-3',
        'text-[var(--text-large)]',
        'rounded-[var(--radius-12)]'
      ]
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
