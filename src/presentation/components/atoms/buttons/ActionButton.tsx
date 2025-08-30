'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
}

const variantClasses = {
  default: 'bg-accent text-on-accent hover:bg-accent/90',
  ghost: 'text-muted hover:text-foreground hover:bg-accent/10',
  outline: 'border border-border text-foreground hover:bg-accent/10',
};

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export const ActionButton = ({
  children,
  variant = 'default',
  size = 'md',
  isLoading = false,
  loadingText,
  className,
  disabled,
  ...props
}: ActionButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        children
      )}
    </button>
  );
};
