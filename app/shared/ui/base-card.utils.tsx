import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils/cn';

import {
  CARD_VARIANTS,
  ANIMATION_CONFIGS,
  type AnimationConfig,
  type CardVariant,
} from './base-card.config';
import type { BaseCardProps } from './base-card.types';

interface LayoutConfig {
  layout: 'flex' | 'block' | 'grid';
  direction: 'row' | 'column';
  align: string;
  justify: string;
  gap: string;
}

export function buildLayoutClasses({ layout, direction, align, justify, gap }: LayoutConfig): string {
  return cn(
    layout === 'flex' && `flex items-${align}`,
    layout === 'flex' && direction === 'row' && `flex-row justify-${justify}`,
    layout === 'flex' && direction === 'column' && 'flex-col',
    layout === 'block' && 'block',
    layout === 'grid' && 'grid',
    gap
  );
}

export function buildVariantClasses(
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

export function useBaseCard(props: BaseCardProps) {
  const {
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
    ...rest
  } = props;

  const cardVariant = { ...CARD_VARIANTS[variant], ...customVariant };
  const animationConfig = { ...ANIMATION_CONFIGS[animation], ...customAnimation };
  const baseClasses = cn(
    buildLayoutClasses({ layout, direction, align, justify, gap }),
    buildVariantClasses(cardVariant, animationConfig, isActive),
    className
  );

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
    props: rest,
  };

  return { animationConfig, commonProps };
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

export function renderFramerMotion({
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

export function renderCSS({
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
