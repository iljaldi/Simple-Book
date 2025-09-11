import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, label, helperText, ...props }, ref) => {
    const inputId = React.useId();
    const helperTextId = React.useId();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[var(--text-small)] font-medium text-[var(--color-text-primary)] mb-2"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            'flex h-10 w-full rounded-[var(--radius-8)] border px-3 py-2',
            'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]',
            'placeholder:text-[var(--color-text-quaternary)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-bg)] focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors duration-200',
            error
              ? 'border-[var(--color-red)] focus:ring-[var(--color-red)]'
              : 'border-[var(--color-border-primary)] hover:border-[var(--color-border-secondary)]',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? helperTextId : undefined}
          {...props}
        />
        {(error || helperText) && (
          <p
            id={helperTextId}
            className={cn(
              'mt-2 text-[var(--text-small)]',
              error
                ? 'text-[var(--color-red)]'
                : 'text-[var(--color-text-tertiary)]'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
