'use client';

import Link from 'next/link';
import React, { memo } from 'react';

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

interface GlassCardLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className: string;
  children: React.ReactNode;
  href: string;
}

const GlassCardLink = memo(
  React.forwardRef<HTMLAnchorElement, GlassCardLinkProps>(function GlassCardLink(
    { className, children, ...props },
    ref
  ) {
    return (
      <Link ref={ref} className={cn('group', className)} {...props}>
        {children}
      </Link>
    );
  })
);
GlassCardLink.displayName = 'GlassCardLink';

interface GlassCardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className: string;
  children: React.ReactNode;
}

const GlassCardButton = memo(
  React.forwardRef<HTMLButtonElement, GlassCardButtonProps>(function GlassCardButton(
    { className, children, ...props },
    ref
  ) {
    return (
      <button ref={ref} className={cn('group text-left', className)} {...props}>
        {children}
      </button>
    );
  })
);
GlassCardButton.displayName = 'GlassCardButton';

const renderLink = (
  ref: React.ForwardedRef<HTMLAnchorElement>,
  href: string,
  className: string,
  children: React.ReactNode,
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>
) => (
  <GlassCardLink ref={ref} href={href} className={className} {...props}>
    {children}
  </GlassCardLink>
);

const renderButton = (
  ref: React.ForwardedRef<HTMLButtonElement>,
  onClick: () => void,
  className: string,
  children: React.ReactNode,
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => (
  <GlassCardButton ref={ref} onClick={onClick} className={className} {...props}>
    {children}
  </GlassCardButton>
);

const renderDiv = (
  ref: React.ForwardedRef<HTMLDivElement>,
  className: string,
  children: React.ReactNode,
  props: React.HTMLAttributes<HTMLDivElement>
) => (
  <div ref={ref} className={cn('group', className)} {...props}>
    {children}
  </div>
);

export const GlassCard = memo(
  React.forwardRef<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement, GlassCardProps>(
    function GlassCard(
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
    ) {
      const baseClasses = cn(
        'backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300',
        animate && 'content-visibility-auto animate-fade-in-up',
        GLASS_CARD_VARIANTS[variant],
        GLASS_CARD_SIZES[size],
        GLASS_CARD_RADIUS[radius],
        className
      );

      if (href)
        return renderLink(
          ref as React.ForwardedRef<HTMLAnchorElement>,
          href,
          baseClasses,
          children,
          props as React.AnchorHTMLAttributes<HTMLAnchorElement>
        );
      if (onClick)
        return renderButton(
          ref as React.ForwardedRef<HTMLButtonElement>,
          onClick,
          baseClasses,
          children,
          props as React.ButtonHTMLAttributes<HTMLButtonElement>
        );
      return renderDiv(
        ref as React.ForwardedRef<HTMLDivElement>,
        baseClasses,
        children,
        props as React.HTMLAttributes<HTMLDivElement>
      );
    }
  )
);
GlassCard.displayName = 'GlassCard';
