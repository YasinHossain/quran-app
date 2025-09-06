import { cn } from '@/lib/utils/cn';

import { buildLayoutClasses } from './base-card/layout';
import { buildVariantClasses } from './base-card/variant';
import { CARD_VARIANTS, ANIMATION_CONFIGS } from './base-card.config';

import type { BaseCardProps } from './base-card.types';

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
