import { buildCommonProps, normalizeProps } from './base-card/builders';
import { computeBaseClasses, mergeAnimationConfig, mergeCardVariant } from './base-card/helpers';
import { CARD_VARIANTS, ANIMATION_CONFIGS } from './base-card.config';

import type {
  BaseCardCommonProps,
  BaseCommonProps,
  DivCommonProps,
  LinkCommonProps,
} from './base-card/common-types';
import type { AnimationConfig, CardVariant } from './base-card.config';
import type { BaseCardProps } from './base-card.types';

type NormalizedProps = ReturnType<typeof normalizeProps>;
type NormalizedBase = NormalizedProps['base'];
type NormalizedLayout = NormalizedProps['layout'];

interface BaseCardHookReturn {
  animationConfig: AnimationConfig;
  commonProps: BaseCardCommonProps;
}

const resolveVariant = (key: string, custom?: BaseCardProps['customVariant']): CardVariant =>
  mergeCardVariant((CARD_VARIANTS[key] ?? CARD_VARIANTS['navigation']) as CardVariant, custom);

const resolveAnimation = (
  key: string,
  custom?: BaseCardProps['customAnimation']
): AnimationConfig =>
  mergeAnimationConfig(
    (ANIMATION_CONFIGS[key] ?? ANIMATION_CONFIGS['navigation']) as AnimationConfig,
    custom
  );

const buildComputeOptions = (
  layout: NormalizedLayout,
  cardVariant: CardVariant,
  animationConfig: AnimationConfig,
  base: NormalizedBase
): Parameters<typeof computeBaseClasses>[0] => ({
  layout: layout.layout,
  direction: layout.direction,
  align: layout.align,
  justify: layout.justify,
  gap: layout.gap,
  cardVariant,
  animationConfig,
  isActive: base.isActive,
  ...(base.className ? { className: base.className } : {}),
});

const buildBaseCommonProps = (baseClasses: string, base: NormalizedBase): BaseCommonProps => ({
  baseClasses,
  children: base.children,
  ...(base.dataActive !== undefined ? { dataActive: base.dataActive } : {}),
  ...(base.role !== undefined ? { role: base.role } : {}),
  ...(base.tabIndex !== undefined ? { tabIndex: base.tabIndex } : {}),
  ...(base.ariaLabel !== undefined ? { ariaLabel: base.ariaLabel } : {}),
  ...(base.onKeyDown !== undefined ? { onKeyDown: base.onKeyDown } : {}),
});

export function useBaseCard(props: BaseCardProps): BaseCardHookReturn {
  const normalized = normalizeProps(props);
  const { base, layout } = normalized;

  const cardVariant = resolveVariant(base.variant ?? 'navigation', base.customVariant);
  const animationConfig = resolveAnimation(base.animation ?? 'navigation', base.customAnimation);

  const baseClasses = computeBaseClasses(
    buildComputeOptions(layout, cardVariant, animationConfig, base)
  );
  const commonProps = buildCommonProps(buildBaseCommonProps(baseClasses, base), normalized);

  return { animationConfig, commonProps };
}

export type { BaseCardCommonProps, LinkCommonProps, DivCommonProps };
