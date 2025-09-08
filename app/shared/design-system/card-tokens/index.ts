import { animations } from './animations';
import { borderRadius } from './borders';
import { colors } from './colors';
import { layout } from './layout';
import { patterns } from './patterns';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { states } from './states';
import { typography } from './typography';

export { spacing, typography, colors, shadows, layout, borderRadius, animations, states, patterns };

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
