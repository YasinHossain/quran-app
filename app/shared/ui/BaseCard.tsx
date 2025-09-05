'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { cn } from '@/lib/utils/cn';

import React from 'react';

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
  // Navigation cards (current SidebarCard)
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

  // Folder cards (current FolderCard style)
  folder: {
    padding: 'p-6',
    borderRadius: 'rounded-xl',
    background: {
      inactive: 'bg-surface border border-border',
      active: 'bg-surface border border-border', // Folders don't have active state
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

  // Bookmark cards (current BookmarkCard style)
  bookmark: {
    padding: 'p-5',
    borderRadius: 'rounded-xl',
    background: {
      inactive: 'bg-surface border border-border',
      active: 'bg-surface border border-border', // Bookmarks don't have traditional active state
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
  // CSS-based (current navigation)
  navigation: {
    type: 'css',
    css: {
      transition: 'transition transform',
      hover: 'hover:scale-[1.02]',
    },
  },

  // Framer Motion (current folders)
  folder: {
    type: 'framer',
    framer: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { type: 'spring', stiffness: 400, damping: 25 },
    },
  },

  // Framer Motion (current bookmarks)
  bookmark: {
    type: 'framer',
    framer: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.2 },
    },
  },
};

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

export const BaseCard = ({
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
}: BaseCardProps) => {
  // Merge variant with custom overrides
  const cardVariant = { ...CARD_VARIANTS[variant], ...customVariant };
  const animationConfig = { ...ANIMATION_CONFIGS[animation], ...customAnimation };

  // Build base classes
  const baseClasses = cn(
    // Layout
    layout === 'flex' && `flex items-${align}`,
    layout === 'flex' && direction === 'row' && `flex-row justify-${justify}`,
    layout === 'flex' && direction === 'column' && `flex-col`,
    layout === 'block' && 'block',
    layout === 'grid' && 'grid',
    gap,

    // Variant styles
    cardVariant.padding,
    cardVariant.height,
    cardVariant.borderRadius,

    // State-based background and shadow
    isActive ? cardVariant.background.active : cardVariant.background.inactive,
    isActive ? cardVariant.shadow.active : cardVariant.shadow.inactive,

    // Hover effects (for CSS-based animations)
    animationConfig.type === 'css' && cardVariant.hover.duration,
    animationConfig.type === 'css' && cardVariant.hover.value,

    // Group for child hover effects
    'group',

    // Custom classes
    className
  );

  // Content to render
  const content = <>{children}</>;

  // Choose rendering approach based on animation type
  if (animationConfig.type === 'framer' && animationConfig.framer) {
    // Framer Motion approach
    const MotionComponent = href ? motion(Link) : motion.div;

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
        initial={animationConfig.framer.initial}
        animate={animationConfig.framer.animate}
        exit={animationConfig.framer.exit}
        transition={animationConfig.framer.transition}
        whileHover={animationConfig.framer.hover}
        {...props}
      >
        {content}
      </MotionComponent>
    );
  } else {
    // CSS-based approach (current SidebarCard)
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
          {content}
        </Link>
      );
    } else {
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
          {content}
        </div>
      );
    }
  }
};

// Convenience components for common patterns
export const NavigationCard = ({
  children,
  ...props
}: Omit<BaseCardProps, 'variant' | 'animation'> & { children?: React.ReactNode }): React.JSX.Element => (
  <BaseCard variant="navigation" animation="navigation" {...props}>
    {children}
  </BaseCard>
);

export const FolderCardBase = ({
  children,
  ...props
}: Omit<BaseCardProps, 'variant' | 'animation'> & { children?: React.ReactNode }): React.JSX.Element => (
  <BaseCard variant="folder" animation="folder" {...props}>
    {children}
  </BaseCard>
);

export const BookmarkCardBase = ({
  children,
  ...props
}: Omit<BaseCardProps, 'variant' | 'animation'> & { children?: React.ReactNode }): React.JSX.Element => (
  <BaseCard variant="bookmark" animation="bookmark" {...props}>
    {children}
  </BaseCard>
);

// Export types for external use
export type { BaseCardProps, CardVariant, AnimationConfig };
