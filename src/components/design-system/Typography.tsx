import React from 'react';
import { cn } from '@/lib/utils';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 
    | 'title-1' | 'title-2' | 'title-3' | 'title-4' | 'title-5' | 'title-6' | 'title-7' | 'title-8' | 'title-9'
    | 'text-large' | 'text-regular' | 'text-small' | 'text-mini' | 'text-micro' | 'text-tiny';
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = 'text-regular', as, children, ...props }, ref) => {
    const Component = as || getDefaultElement(variant);

    const variants = {
      'title-1': 'var(--title-1)',
      'title-2': 'var(--title-2)',
      'title-3': 'var(--title-3)',
      'title-4': 'var(--title-4)',
      'title-5': 'var(--title-5)',
      'title-6': 'var(--title-6)',
      'title-7': 'var(--title-7)',
      'title-8': 'var(--title-8)',
      'title-9': 'var(--title-9)',
      'text-large': 'var(--text-large)',
      'text-regular': 'var(--text-regular)',
      'text-small': 'var(--text-small)',
      'text-mini': 'var(--text-mini)',
      'text-micro': 'var(--text-micro)',
      'text-tiny': 'var(--text-tiny)'
    };

    return React.createElement(
      Component,
      {
        ref,
        className: cn(
          'text-[var(--color-text-primary)]',
          variants[variant],
          className
        ),
        ...props
      },
      children
    );
  }
);

function getDefaultElement(variant: string): keyof JSX.IntrinsicElements {
  if (variant.startsWith('title-')) {
    const level = parseInt(variant.split('-')[1]);
    if (level >= 1 && level <= 6) {
      return `h${level}` as keyof JSX.IntrinsicElements;
    }
    return 'h1';
  }
  return 'p';
}

Typography.displayName = 'Typography';

export { Typography };
