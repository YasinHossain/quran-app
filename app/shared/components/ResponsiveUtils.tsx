'use client';

import { useResponsiveState, responsiveClasses, touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils';

import React from 'react';

/**
 * Pre-built responsive components that adapt without breakpoint-specific code
 */

interface ResponsiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * Button that adapts its size and spacing based on screen size
 */
export const ResponsiveButton = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ResponsiveButtonProps): React.JSX.Element => {
  const { variant: layoutVariant } = useResponsiveState();

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-accent text-on-accent hover:bg-accent-hover';
      case 'secondary':
        return 'bg-surface border border-border text-foreground hover:bg-interactive';
      case 'ghost':
        return 'text-foreground hover:bg-interactive/50';
      default:
        return 'bg-accent text-on-accent hover:bg-accent-hover';
    }
  };

  const getSizeClasses = () => {
    const baseSize =
      size === 'sm'
        ? 'px-3 py-1.5 text-sm'
        : size === 'lg'
          ? 'px-6 py-3 text-lg'
          : 'px-4 py-2 text-base';

    // Add extra padding on mobile for better touch targets
    const mobilePadding = layoutVariant === 'compact' ? 'px-4 py-3' : baseSize;

    return mobilePadding;
  };

  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-all duration-200',
        touchClasses.target,
        touchClasses.focus,
        touchClasses.active,
        touchClasses.gesture,
        getVariantClasses(),
        getSizeClasses(),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

interface ResponsiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

/**
 * Input that adapts its sizing and layout for different screen sizes
 */
export const ResponsiveInput = ({
  label,
  error,
  hint,
  className,
  ...props
}: ResponsiveInputProps): React.JSX.Element => {
  return (
    <div className="space-y-1">
      {label && (
        <label className={cn(responsiveClasses.caption, 'font-medium text-foreground')}>
          {label}
        </label>
      )}

      <input
        className={cn(
          'w-full rounded-lg border border-input-border bg-input-background',
          'text-foreground placeholder:text-input-placeholder',
          'transition-all duration-200',
          touchClasses.target,
          touchClasses.focus,
          responsiveClasses.input,
          error && 'border-status-error',
          className
        )}
        {...props}
      />

      {error && <p className={cn(responsiveClasses.caption, 'text-status-error')}>{error}</p>}

      {hint && !error && <p className={cn(responsiveClasses.caption, 'text-muted')}>{hint}</p>}
    </div>
  );
};

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

/**
 * Card that adapts its spacing and interaction based on screen size
 */
export const ResponsiveCard = ({
  children,
  className,
  padding = true,
  hover = false,
  onClick,
}: ResponsiveCardProps): React.JSX.Element => {
  const { variant } = useResponsiveState();

  const getPaddingClasses = () => {
    if (!padding) return '';

    // Smaller padding on mobile, larger on desktop
    switch (variant) {
      case 'compact':
        return 'p-3';
      case 'default':
        return 'p-4';
      case 'expanded':
        return 'p-6';
      default:
        return 'p-4';
    }
  };

  return (
    <div
      className={cn(
        'bg-surface rounded-lg border border-border',
        'transition-all duration-200',
        getPaddingClasses(),
        hover && 'hover:shadow-card-hover hover:border-accent/20 cursor-pointer',
        onClick && touchClasses.active,
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
};

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Grid that automatically adjusts columns based on screen size
 */
export const ResponsiveGrid = ({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className,
}: ResponsiveGridProps): React.JSX.Element => {
  const getGridClasses = () => {
    const gapClass = gap === 'sm' ? 'gap-2' : gap === 'lg' ? 'gap-6' : 'gap-4';

    const colClasses = [
      `grid-cols-${columns.mobile || 1}`,
      columns.tablet && `sm:grid-cols-${columns.tablet}`,
      columns.desktop && `lg:grid-cols-${columns.desktop}`,
    ]
      .filter(Boolean)
      .join(' ');

    return cn('grid', colClasses, gapClass);
  };

  return <div className={cn(getGridClasses(), className)}>{children}</div>;
};

/**
 * Hook for accessing responsive utilities in any component
 */
export const useResponsiveHelpers = () => {
  const state = useResponsiveState();

  return {
    ...state,
    classes: responsiveClasses,
    touch: touchClasses,

    // Utility functions
    getSpacing: (size: 'sm' | 'md' | 'lg') => {
      const multiplier = state.variant === 'compact' ? 0.8 : state.variant === 'expanded' ? 1.2 : 1;

      const baseSize = size === 'sm' ? 8 : size === 'lg' ? 24 : 16;
      return Math.round(baseSize * multiplier);
    },

    getFontSize: (size: 'sm' | 'md' | 'lg') => {
      const scale = state.variant === 'compact' ? 0.9 : state.variant === 'expanded' ? 1.1 : 1;

      const baseSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
      return Math.round(baseSize * scale);
    },
  };
};

/**
 * Layout components that replace multiple breakpoint-specific components
 */
export const ResponsiveStack = ({
  children,
  className,
  spacing = 'md',
}: {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
}): React.JSX.Element => {
  const { variant } = useResponsiveState();

  const getSpacing = () => {
    const base = spacing === 'sm' ? 'gap-2' : spacing === 'lg' ? 'gap-6' : 'gap-4';

    // Tighter spacing on mobile
    if (variant === 'compact') {
      return spacing === 'sm' ? 'gap-1' : spacing === 'lg' ? 'gap-4' : 'gap-3';
    }

    return base;
  };

  return <div className={cn('flex flex-col', getSpacing(), className)}>{children}</div>;
};

export const ResponsiveRow = ({
  children,
  className,
  wrap = true,
  align = 'center',
  justify = 'start',
}: {
  children: React.ReactNode;
  className?: string;
  wrap?: boolean;
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between';
}): React.JSX.Element => {
  const { variant } = useResponsiveState();

  // Stack on mobile, row on larger screens
  const direction = variant === 'compact' ? 'flex-col' : 'flex-row';
  const wrapClass = wrap && variant !== 'compact' ? 'flex-wrap' : '';

  const alignClass = `items-${align}`;
  const justifyClass = `justify-${justify}`;

  return (
    <div className={cn('flex gap-3', direction, wrapClass, alignClass, justifyClass, className)}>
      {children}
    </div>
  );
};
