import React from 'react';
import { cn } from '@/lib/utils';

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  size?: 'small' | 'medium' | 'large' | 'xl';
  color?: string;
}

const Icon = React.forwardRef<HTMLElement, IconProps>(
  ({ className, name, size = 'medium', color, ...props }, ref) => {
    const sizes = {
      small: 'h-4 w-4',
      medium: 'h-5 w-5',
      large: 'h-6 w-6',
      xl: 'h-8 w-8'
    };

    return (
      <i
        ref={ref as React.Ref<HTMLElement>}
        className={cn(
          'ri',
          `ri-${name}`,
          'text-[var(--color-text-primary)]',
          sizes[size],
          className
        )}
        style={{ color }}
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';

export { Icon };