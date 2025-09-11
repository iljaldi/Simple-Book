import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonVariantsProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
}

const ButtonVariants = React.forwardRef<HTMLButtonElement, ButtonVariantsProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    icon, 
    iconPosition = 'left',
    loading = false,
    disabled = false,
    children, 
    ...props 
  }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-purple-600 text-white hover:bg-purple-700 shadow-low",
      secondary: "bg-gray-600 text-white hover:bg-gray-700 shadow-low",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-low",
      ghost: "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700",
      link: "text-purple-600 underline-offset-4 hover:underline dark:text-purple-400"
    };
    
    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base"
    };

    // Icon mapping for remixicon replacement
    const iconMap: Record<string, string> = {
      'plus': 'ri-add-line',
      'search': 'ri-search-line',
      'settings': 'ri-settings-line',
      'star': 'ri-star-line',
      'refresh': 'ri-refresh-line'
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <i className={`ri ${iconMap['refresh'] || 'ri-refresh-line'} mr-2 animate-spin`} />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <i className={`ri ${iconMap[icon] || 'ri-edit-line'} mr-2`} />
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <i className={`ri ${iconMap[icon] || 'ri-edit-line'} ml-2`} />
        )}
      </button>
    );
  }
);

ButtonVariants.displayName = 'ButtonVariants';

export { ButtonVariants };
