import { colors } from './colors';
import { layout } from './layout';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';

export { spacing, typography, colors, shadows, layout };

export const borderRadius = {
  card: 'rounded-xl',
  inner: 'rounded-lg',
  full: 'rounded-full',
} as const;

export const animations = {
  transitions: {
    fast: 'transition-all duration-200',
    normal: 'transition-all duration-300',
    transform: 'transition transform',
    colors: 'transition-colors',
    colorsNormal: 'transition-colors duration-200',
    opacity: 'transition-opacity duration-200',
  },
  hover: {
    scaleSmall: 'hover:scale-[1.02]',
    translateUp: 'hover:-translate-y-1',
    translateUpSmall: 'hover:-translate-y-0.5',
  },
  framer: {
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
    spring: { type: 'spring', stiffness: 400, damping: 25 },
    smooth: { duration: 0.2 },
    medium: { duration: 0.3 },
  },
} as const;

export const states = {
  opacity: {
    hidden: 'opacity-0',
    visible: 'opacity-100',
    hover: 'opacity-0 group-hover:opacity-100',
  },
  interactive: {
    cursor: 'cursor-pointer',
    touchManipulation: 'touch-manipulation',
    focusRing:
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
  },
  content: {
    truncate: 'truncate',
    clamp2: 'line-clamp-2',
    whitespaceNowrap: 'whitespace-nowrap',
  },
} as const;

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

export const buildCardClasses = (
  variant: 'navigation' | 'folder' | 'bookmark',
  isActive = false
): string => {
  const base = patterns[`${variant}Card` as keyof typeof patterns] as string;
  if (variant === 'navigation') {
    const background = isActive
      ? `${colors.background.accent} ${colors.text.active}`
      : `${colors.background.surface} ${colors.text.primary}`;
    const shadow = isActive ? shadows.accent : shadows.normal;
    return `${base} ${background} ${shadow}`;
  }
  return base;
};

export const buildTextClasses = (
  type: 'primary' | 'secondary' | 'arabic',
  isActive = false
): string => {
  if (type === 'arabic') {
    return patterns.arabicText(isActive);
  }
  const textPattern = type === 'primary' ? patterns.primaryText : patterns.secondaryText;
  return textPattern(isActive);
};
