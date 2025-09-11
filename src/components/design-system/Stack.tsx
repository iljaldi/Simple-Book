import React from 'react';
import { cn } from '@/lib/utils';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  wrap?: boolean;
  children: React.ReactNode;
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ 
    className, 
    direction = 'vertical', 
    spacing = 'md', 
    align = 'stretch',
    justify = 'start',
    wrap = false,
    children, 
    ...props 
  }, ref) => {
    const directions = {
      horizontal: 'flex-row',
      vertical: 'flex-col'
    };

    const spacings = {
      xs: direction === 'horizontal' ? 'space-x-1' : 'space-y-1',
      sm: direction === 'horizontal' ? 'space-x-2' : 'space-y-2',
      md: direction === 'horizontal' ? 'space-x-4' : 'space-y-4',
      lg: direction === 'horizontal' ? 'space-x-6' : 'space-y-6',
      xl: direction === 'horizontal' ? 'space-x-8' : 'space-y-8',
      '2xl': direction === 'horizontal' ? 'space-x-12' : 'space-y-12'
    };

    const aligns = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch'
    };

    const justifies = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      'space-between': 'justify-between',
      'space-around': 'justify-around',
      'space-evenly': 'justify-evenly'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          directions[direction],
          spacings[spacing],
          aligns[align],
          justifies[justify],
          wrap && 'flex-wrap',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';

export { Stack };
