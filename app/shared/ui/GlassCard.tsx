'use client';

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

import { GlassCardButton, GlassCardLink } from './GlassCardPrimitives';

type RenderLinkArgs = {
  ref: React.ForwardedRef<HTMLAnchorElement>;
  href: string;
  className: string;
  children: React.ReactNode;
};

const renderLink = ({ ref, href, className, children }: RenderLinkArgs): React.JSX.Element => (
  <GlassCardLink ref={ref} href={href} className={className}>
    {children}
  </GlassCardLink>
);

type RenderButtonArgs = {
  ref: React.ForwardedRef<HTMLButtonElement>;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
};

const renderButton = ({
  ref,
  onClick,
  className,
  children,
}: RenderButtonArgs): React.JSX.Element => (
  <GlassCardButton ref={ref} onClick={onClick} className={className}>
    {children}
  </GlassCardButton>
);

type RenderDivArgs = {
  ref: React.ForwardedRef<HTMLDivElement>;
  className: string;
  children: React.ReactNode;
};

const renderDiv = ({ ref, className, children }: RenderDivArgs): React.JSX.Element => (
  <div ref={ref} className={cn('group', className)}>
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
        asChild, // reserved for future slot support
      },
      ref
    ) {
      void asChild;
      const baseClasses = cn(
        'backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300',
        animate && 'content-visibility-auto animate-fade-in-up',
        GLASS_CARD_VARIANTS[variant],
        GLASS_CARD_SIZES[size],
        GLASS_CARD_RADIUS[radius],
        className
      );

      if (href)
        return renderLink({
          ref: ref as React.ForwardedRef<HTMLAnchorElement>,
          href,
          className: baseClasses,
          children,
        });
      if (onClick)
        return renderButton({
          ref: ref as React.ForwardedRef<HTMLButtonElement>,
          onClick,
          className: baseClasses,
          children,
        });
      return renderDiv({
        ref: ref as React.ForwardedRef<HTMLDivElement>,
        className: baseClasses,
        children,
      });
    }
  )
);
GlassCard.displayName = 'GlassCard';
