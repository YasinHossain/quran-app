import { parseBooleanEnv } from './utils';

/**
 * Feature flag configuration segment.
 *
 * Controls optional capabilities that can be toggled without code changes.
 */
export interface FeaturesConfig {
  enableOfflineMode: boolean;
  enableAnalytics: boolean;
  enablePushNotifications: boolean;
  enableServiceWorker: boolean;
  enableErrorTracking: boolean;
  enablePerformanceMonitoring: boolean;
  enableQuranApiProxy: boolean;
}

export const featuresConfig: FeaturesConfig = {
  enableOfflineMode: parseBooleanEnv('NEXT_PUBLIC_OFFLINE_MODE', false),
  enableAnalytics: parseBooleanEnv('NEXT_PUBLIC_ANALYTICS', false),
  enablePushNotifications: parseBooleanEnv('NEXT_PUBLIC_PUSH_NOTIFICATIONS', false),
  enableServiceWorker: !parseBooleanEnv('NEXT_DISABLE_PWA', false),
  enableErrorTracking: parseBooleanEnv('NEXT_PUBLIC_ERROR_TRACKING', false),
  enablePerformanceMonitoring: parseBooleanEnv('NEXT_PUBLIC_PERFORMANCE_MONITORING', false),
  enableQuranApiProxy: parseBooleanEnv('NEXT_PUBLIC_ENABLE_QURAN_PROXY', false),
};
