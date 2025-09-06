import { motion } from 'framer-motion';
import Link from 'next/link';
import type React from 'react';

import type { AnimationConfig } from '../base-card.config';

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
