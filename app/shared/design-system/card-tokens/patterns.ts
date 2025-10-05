/**
 * Card pattern tokens
 */
import { animations } from './animations';
import { borderRadius } from './borders';
import { colors } from './colors';
import { layout } from './layoutTokens';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { states } from './states';
import { typography } from './typography';

export const patterns = {
  navigationCard: [
    layout.flex.row,
    spacing.normal,
    borderRadius.card,
    animations.transitions.transform,
    animations.hover.scaleSmall,
    layout.height.fixed,
    'group',
  ].join(' '),
  folderCard: [
    spacing.spacious,
    borderRadius.card,
    colors.background.surface,
    colors.background.border,
    shadows.subtle,
    animations.transitions.normal,
    animations.hover.translateUp,
    shadows.hoverElevated,
    colors.background.borderHover,
    states.interactive.cursor,
    states.interactive.touchManipulation,
    states.interactive.focusRing,
    'group relative',
  ].join(' '),
  bookmarkCard: [
    borderRadius.card,
    colors.background.surface,
    colors.background.border,
    spacing.comfortable,
    spacing.listMarginBottom,
    colors.background.borderHover30,
    colors.background.surfaceHover,
    animations.transitions.fast,
    states.interactive.cursor,
    shadows.hoverMedium,
    animations.hover.translateUpSmall,
    'group',
  ].join(' '),
  primaryText: (isActive: boolean) =>
    [isActive ? colors.text.active : colors.text.primary, typography.lineHeight.tight, 'mb-0'].join(
      ' '
    ),
  secondaryText: (isActive: boolean) =>
    [
      typography.secondary.small,
      isActive ? colors.text.activeSecondary : colors.text.secondary,
      typography.lineHeight.tight,
      'mt-2 mb-0',
    ].join(' '),
  arabicText: (isActive: boolean) =>
    [
      typography.arabic.font,
      typography.arabic.size,
      typography.arabic.weight,
      animations.transitions.colors,
      states.content.whitespaceNowrap,
      isActive ? colors.text.active : `${colors.text.secondary} ${colors.text.hoverAccent}`,
    ].join(' '),
} as const;
