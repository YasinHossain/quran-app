import { z } from 'zod';

import { parseBooleanEnv } from './utils';

/**
 * Feature flag configuration segment.
 *
 * Controls optional capabilities that can be toggled without code changes.
 */
export const featuresSchema = z.object({
  enableOfflineMode: z.boolean().default(false),
  enableAnalytics: z.boolean().default(false),
  enablePushNotifications: z.boolean().default(false),
  enableServiceWorker: z.boolean().default(true),
  enableErrorTracking: z.boolean().default(false),
  enablePerformanceMonitoring: z.boolean().default(false),
  enableQuranApiProxy: z.boolean().default(false),
});

export type FeaturesConfig = z.infer<typeof featuresSchema>;

export const featuresConfig: FeaturesConfig = {
  enableOfflineMode: parseBooleanEnv('NEXT_PUBLIC_OFFLINE_MODE', false),
  enableAnalytics: parseBooleanEnv('NEXT_PUBLIC_ANALYTICS', false),
  enablePushNotifications: parseBooleanEnv('NEXT_PUBLIC_PUSH_NOTIFICATIONS', false),
  enableServiceWorker: !parseBooleanEnv('NEXT_DISABLE_PWA', false),
  enableErrorTracking: parseBooleanEnv('NEXT_PUBLIC_ERROR_TRACKING', false),
  enablePerformanceMonitoring: parseBooleanEnv('NEXT_PUBLIC_PERFORMANCE_MONITORING', false),
  enableQuranApiProxy: parseBooleanEnv('NEXT_PUBLIC_ENABLE_QURAN_PROXY', false),
};
