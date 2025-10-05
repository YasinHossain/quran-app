import {
  CARD_VARIANTS,
  ANIMATION_CONFIGS,
  type CardVariant,
  type AnimationConfig,
} from './base-card.config';

import type { LinkProps } from 'next/link';
import type React from 'react';

type AnchorRestProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'className' | 'href' | 'onClick'
>;

type DivRestProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'className' | 'onClick'
>;

type BaseSharedProps = {
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
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
  prefetch?: LinkProps['prefetch'];
  replace?: LinkProps['replace'];
  shallow?: LinkProps['shallow'];
  locale?: LinkProps['locale'];
  scroll?: LinkProps['scroll'];
};

export type BaseCardProps = BaseSharedProps &
  AnchorRestProps &
  DivRestProps & {
    href?: LinkProps['href'];
  };

export type ConvenienceCardProps = Omit<BaseCardProps, 'variant' | 'animation'> & {
  children?: React.ReactNode;
};

export type { CardVariant, AnimationConfig };
