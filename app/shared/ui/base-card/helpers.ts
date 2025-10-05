import { cn } from '@/lib/utils/cn';

import { buildLayoutClasses } from './layoutClasses';
import { buildVariantClasses } from './variant';

import type { AnimationConfig, CardVariant } from '@/app/shared/ui/base-card.config';
import type { BaseCardProps } from '@/app/shared/ui/base-card.types';

const mergeCardVariant = (base: CardVariant, override?: Partial<CardVariant>): CardVariant => {
  if (!override) return base;
  return {
    ...base,
    ...(override.padding !== undefined ? { padding: override.padding } : {}),
    ...(override.borderRadius !== undefined ? { borderRadius: override.borderRadius } : {}),
    ...(Object.prototype.hasOwnProperty.call(override, 'height')
      ? { height: override.height }
      : {}),
    background: { ...base.background, ...(override.background ?? {}) },
    hover: { ...base.hover, ...(override.hover ?? {}) },
    shadow: { ...base.shadow, ...(override.shadow ?? {}) },
  };
};

const mergeOptionalSection = <T extends Record<string, unknown>>(
  baseSection: T | undefined,
  overrideSection: Partial<T> | undefined
): T | undefined => {
  if (!baseSection && !overrideSection) return baseSection;
  return { ...(baseSection ?? {}), ...(overrideSection ?? {}) } as T;
};

const mergeAnimationConfig = (
  base: AnimationConfig,
  override?: Partial<AnimationConfig>
): AnimationConfig => {
  if (!override) return base;
  const css = mergeOptionalSection(base.css, override.css);
  const framer = mergeOptionalSection(base.framer, override.framer);
  return {
    ...base,
    type: override.type ?? base.type,
    ...(css ? { css } : {}),
    ...(framer ? { framer } : {}),
  };
};

interface ComputeClassOptions {
  layout: BaseCardProps['layout'];
  direction: BaseCardProps['direction'];
  align: BaseCardProps['align'];
  justify: BaseCardProps['justify'];
  gap: string;
  cardVariant: CardVariant;
  animationConfig: AnimationConfig;
  isActive: boolean;
  className?: string;
}

const computeBaseClasses = ({
  layout,
  direction,
  align,
  justify,
  gap,
  cardVariant,
  animationConfig,
  isActive,
  className,
}: ComputeClassOptions): string =>
  cn(
    buildLayoutClasses({
      layout: layout ?? 'flex',
      direction: direction ?? 'row',
      align: align ?? 'center',
      justify: justify ?? 'start',
      gap,
    }),
    buildVariantClasses(cardVariant, animationConfig, isActive),
    className
  );

export { computeBaseClasses, mergeAnimationConfig, mergeCardVariant };
