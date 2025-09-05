'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React, { memo } from 'react';

import { cn } from '@/lib/utils/cn';

// Design token types
interface CardVariant {
  padding: string;
  height?: string;
  borderRadius: string;
  background: {
    inactive: string;
    active: string;
  };
  hover: {
    effect: 'scale' | 'translate' | 'none';
    value: string;
    duration: string;
  };
  shadow: {
    inactive: string;
    active: string;
  };
}

// Animation system types
interface AnimationConfig {
  type: 'css' | 'framer';
  css?: {
    transition: string;
    hover: string;
  };
  framer?: {
    initial: Record<string, string | number>;
    animate: Record<string, string | number>;
    exit?: Record<string, string | number>;
    transition: Record<string, string | number>;
    hover?: Record<string, string | number>;
  };
}

// Predefined variants based on current designs
const CARD_VARIANTS: Record<string, CardVariant> = {
  navigation: {
    padding: 'p-4',
    height: 'h-[80px]',
    borderRadius: 'rounded-xl',
    background: {
      inactive: 'bg-surface text-foreground',
      active: 'bg-accent text-on-accent',
    },
    hover: {
      effect: 'scale',
      value: 'hover:scale-[1.02]',
      duration: 'transition transform',
    },
    shadow: {
      inactive: 'shadow',
      active: 'shadow-lg shadow-accent/30',
    },
  },
  folder: {
    padding: 'p-6',
    borderRadius: 'rounded-xl',
    background: {
      inactive: 'bg-surface border border-border',
      active: 'bg-surface border border-border',
    },
    hover: {
      effect: 'translate',
      value: 'hover:-translate-y-1 hover:shadow-lg hover:border-accent/20',
      duration: 'transition-all duration-300',
    },
    shadow: {
      inactive: 'shadow-sm',
      active: 'shadow-sm',
    },
  },
  bookmark: {
    padding: 'p-5',
    borderRadius: 'rounded-xl',
    background: {
      inactive: 'bg-surface border border-border',
      active: 'bg-surface border border-border',
    },
    hover: {
      effect: 'translate',
      value: 'hover:-translate-y-0.5 hover:shadow-md hover:border-accent/30 hover:bg-surface-hover',
      duration: 'transition-all duration-200',
    },
    shadow: {
      inactive: '',
      active: '',
    },
  },
};

// Animation configurations based on current patterns
const ANIMATION_CONFIGS: Record<string, AnimationConfig> = {
  navigation: {
    type: 'css',
    css: {
      transition: 'transition transform',
      hover: 'hover:scale-[1.02]',
    },
  },
  folder: {
    type: 'framer',
    framer: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { type: 'spring', stiffness: 400, damping: 25 },
    },
  },
  bookmark: {
    type: 'framer',
    framer: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.2 },
    },
  },
};

// Helper functions to reduce complexity
interface LayoutConfig {
  layout: 'flex' | 'block' | 'grid';
  direction: 'row' | 'column';
  align: string;
  justify: string;
  gap: string;
}

function buildLayoutClasses(config: LayoutConfig): string {
  const { layout, direction, align, justify, gap } = config;
  return cn(
    layout === 'flex' && `flex items-${align}`,
    layout === 'flex' && direction === 'row' && `flex-row justify-${justify}`,
    layout === 'flex' && direction === 'column' && `flex-col`,
    layout === 'block' && 'block',
    layout === 'grid' && 'grid',
    gap
  );
}

function buildVariantClasses(
  cardVariant: CardVariant,
  animationConfig: AnimationConfig,
  isActive: boolean
): string {
  return cn(
    cardVariant.padding,
    cardVariant.height,
    cardVariant.borderRadius,
    isActive ? cardVariant.background.active : cardVariant.background.inactive,
    isActive ? cardVariant.shadow.active : cardVariant.shadow.inactive,
    animationConfig.type === 'css' && cardVariant.hover.duration,
    animationConfig.type === 'css' && cardVariant.hover.value,
    'group'
  );
}

interface RenderFramerMotionProps {
  href?: string;
  scroll: boolean;
  baseClasses: string;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
  dataActive?: boolean;
  role?: string;
  tabIndex?: number;
  ariaLabel?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  animationConfig: AnimationConfig;
  children: React.ReactNode;
  props: Record<string, unknown>;
}

function renderFramerMotion({
  href,
  scroll,
  baseClasses,
  onClick,
  dataActive,
  role,
  tabIndex,
  ariaLabel,
  onKeyDown,
  animationConfig,
  children,
  props,
}: RenderFramerMotionProps): React.JSX.Element {
  const MotionComponent = href ? motion(Link) : motion.div;
  const framer = animationConfig.framer!;

  return (
    <MotionComponent
      {...(href ? { href, scroll } : {})}
      className={baseClasses}
      onClick={onClick}
      data-active={dataActive}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      initial={framer.initial}
      animate={framer.animate}
      exit={framer.exit}
      transition={framer.transition}
      whileHover={framer.hover}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

interface RenderCSSProps {
  href?: string;
  scroll: boolean;
  baseClasses: string;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
  dataActive?: boolean;
  role?: string;
  tabIndex?: number;
  ariaLabel?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  children: React.ReactNode;
  props: Record<string, unknown>;
}

function renderCSS({
  href,
  scroll,
  baseClasses,
  onClick,
  dataActive,
  role,
  tabIndex,
  ariaLabel,
  onKeyDown,
  children,
  props,
}: RenderCSSProps): React.JSX.Element {
  if (href) {
    return (
      <Link
        href={href}
        scroll={scroll}
        className={baseClasses}
        onClick={onClick}
        data-active={dataActive}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <div
      className={baseClasses}
      onClick={onClick}
      data-active={dataActive}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      {...props}
    >
      {children}
    </div>
  );
}

interface BaseCardProps {
  // Core functionality
  children: React.ReactNode;
  className?: string;

  // Navigation (for Link-based cards)
  href?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
  scroll?: boolean;

  // State management
  isActive?: boolean;
  'data-active'?: boolean;

  // Design variants
  variant?: keyof typeof CARD_VARIANTS;
  animation?: keyof typeof ANIMATION_CONFIGS;

  // Custom overrides
  customVariant?: Partial<CardVariant>;
  customAnimation?: Partial<AnimationConfig>;

  // Accessibility
  role?: string;
  tabIndex?: number;
  'aria-label'?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;

  // Layout control
  layout?: 'flex' | 'block' | 'grid';
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between';
  gap?: string;

  // Additional HTML attributes
  [key: string]: unknown;
}

export const BaseCard = memo(function BaseCard({
  children,
  className,
  href,
  onClick,
  scroll = false,
  isActive = false,
  'data-active': dataActive,
  variant = 'navigation',
  animation = 'navigation',
  customVariant,
  customAnimation,
  role,
  tabIndex,
  'aria-label': ariaLabel,
  onKeyDown,
  layout = 'flex',
  direction = 'row',
  align = 'center',
  justify = 'start',
  gap = 'gap-4',
  ...props
}: BaseCardProps): React.JSX.Element {
  const cardVariant = { ...CARD_VARIANTS[variant], ...customVariant };
  const animationConfig = { ...ANIMATION_CONFIGS[animation], ...customAnimation };

  const layoutClasses = buildLayoutClasses({ layout, direction, align, justify, gap });
  const variantClasses = buildVariantClasses(cardVariant, animationConfig, isActive);
  const baseClasses = cn(layoutClasses, variantClasses, className);

  const commonProps = {
    href,
    scroll,
    baseClasses,
    onClick,
    dataActive,
    role,
    tabIndex,
    ariaLabel,
    onKeyDown,
    children,
    props,
  };

  return animationConfig.type === 'framer' && animationConfig.framer
    ? renderFramerMotion({ ...commonProps, animationConfig })
    : renderCSS(commonProps);
});

// Convenience components for common patterns
type ConvenienceCardProps = Omit<BaseCardProps, 'variant' | 'animation'> & {
  children?: React.ReactNode;
};

export const NavigationCard = (props: ConvenienceCardProps): React.JSX.Element => (
  <BaseCard variant="navigation" animation="navigation" {...props} />
);

export const FolderCardBase = (props: ConvenienceCardProps): React.JSX.Element => (
  <BaseCard variant="folder" animation="folder" {...props} />
);

export const BookmarkCardBase = (props: ConvenienceCardProps): React.JSX.Element => (
  <BaseCard variant="bookmark" animation="bookmark" {...props} />
);

// Export types for external use
export type { BaseCardProps, CardVariant, AnimationConfig };
