import { getEnvVar, parseBooleanEnv, parseNumberEnv } from './utils';

/**
 * User interface configuration segment.
 *
 * Contains presentation-related defaults such as theme and animation settings.
 */
export type UiTheme = 'light' | 'dark' | 'auto';

export interface UiConfig {
  defaultTheme: UiTheme;
  defaultFontSize: number;
  enableAnimations: boolean;
  enableHaptics: boolean;
  animationDuration: number;
}

const resolveTheme = (value: string | undefined): UiTheme => {
  switch (value) {
    case 'light':
    case 'dark':
    case 'auto':
      return value;
    default:
      return 'auto';
  }
};

const resolvePositiveNumber = (value: number | undefined, fallback: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return fallback;
  return value;
};

export const uiConfig: UiConfig = {
  defaultTheme: resolveTheme(getEnvVar('NEXT_PUBLIC_DEFAULT_THEME', 'auto')),
  defaultFontSize: resolvePositiveNumber(parseNumberEnv('NEXT_PUBLIC_DEFAULT_FONT_SIZE', 16), 16),
  enableAnimations: parseBooleanEnv('NEXT_PUBLIC_ENABLE_ANIMATIONS', true),
  enableHaptics: parseBooleanEnv('NEXT_PUBLIC_ENABLE_HAPTICS', false),
  animationDuration: resolvePositiveNumber(parseNumberEnv('UI_ANIMATION_DURATION', 300), 300),
};
