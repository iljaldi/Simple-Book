import React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'small' | 'medium' | 'large' | 'xl';
  shape?: 'circle' | 'square';
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    className, 
    src, 
    alt, 
    fallback, 
    size = 'medium',
    shape = 'circle',
    ...props 
  }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const sizes = {
      small: 'w-8 h-8',
      medium: 'w-10 h-10',
      large: 'w-12 h-12',
      xl: 'w-16 h-16'
    };

    const textSizes = {
      small: 'text-[var(--text-micro)]',
      medium: 'text-[var(--text-small)]',
      large: 'text-[var(--text-regular)]',
      xl: 'text-[var(--text-large)]'
    };

    const shapes = {
      circle: 'rounded-[var(--radius-circle)]',
      square: 'rounded-[var(--radius-8)]'
    };

    const handleImageError = () => {
      setImageError(true);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center',
          'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]',
          'overflow-hidden',
          sizes[size],
          shapes[shape],
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <span className={cn('font-medium', textSizes[size])}>
            {fallback || '?'}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };
