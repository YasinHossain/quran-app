import { z } from 'zod';

import { getEnvVar, parseBooleanEnv, parseNumberEnv } from './utils';

/**
 * User interface configuration segment.
 *
 * Contains presentation-related defaults such as theme and animation settings.
 */
export const uiSchema = z.object({
  defaultTheme: z.enum(['light', 'dark', 'auto']).default('auto'),
  defaultFontSize: z.number().positive().default(16),
  enableAnimations: z.boolean().default(true),
  enableHaptics: z.boolean().default(false),
  animationDuration: z.number().positive().default(300),
});

export type UiConfig = z.infer<typeof uiSchema>;

export const uiConfig: UiConfig = {
  defaultTheme: getEnvVar('NEXT_PUBLIC_DEFAULT_THEME', 'auto') as UiConfig['defaultTheme'],
  defaultFontSize: parseNumberEnv('NEXT_PUBLIC_DEFAULT_FONT_SIZE', 16)!,
  enableAnimations: parseBooleanEnv('NEXT_PUBLIC_ENABLE_ANIMATIONS', true),
  enableHaptics: parseBooleanEnv('NEXT_PUBLIC_ENABLE_HAPTICS', false),
  animationDuration: parseNumberEnv('UI_ANIMATION_DURATION', 300)!,
};
