'use client';

import Link from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils/cn';

export const GLASS_CARD_VARIANTS = {
  surface: 'bg-surface-glass/60',
  primary: 'bg-surface/60',
  input: 'bg-input-background backdrop-blur-xl bg-surface-glass/60',
} as const;

export const GLASS_CARD_SIZES = {
  compact: 'p-3',
  comfortable: 'p-4',
  spacious: 'p-4 sm:p-5',
  large: 'p-4 sm:p-6 md:p-8',
} as const;

export const GLASS_CARD_RADIUS = {
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
} as const;

export interface GlassCardProps {
  children: React.ReactNode;
  variant?: keyof typeof GLASS_CARD_VARIANTS;
  size?: keyof typeof GLASS_CARD_SIZES;
  radius?: keyof typeof GLASS_CARD_RADIUS;
  className?: string;
  href?: string;
  onClick?: () => void;
  asChild?: boolean;
  animate?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement | HTMLAnchorElement, GlassCardProps>(
  (
    {
      children,
      variant = 'surface',
      size = 'comfortable',
      radius = 'xl',
      className,
      href,
      onClick,
      animate = true,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      'backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300',
      animate && 'content-visibility-auto animate-fade-in-up',
      GLASS_CARD_VARIANTS[variant],
      GLASS_CARD_SIZES[size],
      GLASS_CARD_RADIUS[radius],
      className
    );

    // If href is provided, render as Link
    if (href) {
      return (
        <Link
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          href={href}
          className={cn('group', baseClasses)}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </Link>
      );
    }

    // If onClick is provided, render as button
    if (onClick) {
      return (
        <button
          ref={ref as React.ForwardedRef<HTMLButtonElement>}
          onClick={onClick}
          className={cn('group text-left', baseClasses)}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>
      );
    }

    // Default: render as div
    return (
      <div
        ref={ref as React.ForwardedRef<HTMLDivElement>}
        className={cn('group', baseClasses)}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
