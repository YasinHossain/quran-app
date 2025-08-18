'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export const BUTTON_VARIANTS = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover focus:ring-accent/20',
  secondary: 'bg-surface text-foreground hover:bg-interactive-hover border border-border',
  ghost: 'bg-transparent text-foreground hover:bg-interactive-hover',
  outline: 'bg-transparent text-foreground border border-border hover:bg-interactive-hover',
  destructive: 'bg-error text-on-accent hover:bg-error/90 focus:ring-error/20',
} as const;

export const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
  icon: 'p-2',
} as const;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BUTTON_VARIANTS | string;
  size?: keyof typeof BUTTON_SIZES;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', isLoading, className, children, disabled, ...props },
    ref
  ) => {
    const variantClass =
      variant in BUTTON_VARIANTS
        ? BUTTON_VARIANTS[variant as keyof typeof BUTTON_VARIANTS]
        : variant;

    const sizeClass = BUTTON_SIZES[size as keyof typeof BUTTON_SIZES] || BUTTON_SIZES.md;

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variantClass,
          sizeClass,
          className
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-label={isLoading ? 'Loading...' : props['aria-label']}
        {...props}
      >
        {isLoading && (
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
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
