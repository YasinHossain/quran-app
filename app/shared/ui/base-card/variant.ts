import { cn } from '@/lib/utils/cn';
import type { AnimationConfig, CardVariant } from '../base-card.config';

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
