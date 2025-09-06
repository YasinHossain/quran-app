import {
  CARD_VARIANTS,
  ANIMATION_CONFIGS,
  type CardVariant,
  type AnimationConfig,
} from './base-card.config';

import type React from 'react';

export interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
  scroll?: boolean;
  isActive?: boolean;
  'data-active'?: boolean;
  variant?: keyof typeof CARD_VARIANTS;
  animation?: keyof typeof ANIMATION_CONFIGS;
  customVariant?: Partial<CardVariant>;
  customAnimation?: Partial<AnimationConfig>;
  role?: string;
  tabIndex?: number;
  'aria-label'?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  layout?: 'flex' | 'block' | 'grid';
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between';
  gap?: string;
  [key: string]: unknown;
}

export type ConvenienceCardProps = Omit<BaseCardProps, 'variant' | 'animation'> & {
  children?: React.ReactNode;
};

export type { CardVariant, AnimationConfig };
