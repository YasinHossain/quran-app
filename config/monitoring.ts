import { getEnvVar, parseBooleanEnv, parseNumberEnv } from './utils';

/**
 * Monitoring configuration segment.
 *
 * Contains settings for error tracking and analytics providers.
 */
export interface MonitoringConfig {
  sentry?: {
    dsn?: string | undefined;
    environment?: string | undefined;
    tracesSampleRate: number;
    profilesSampleRate: number;
    enablePerformanceMonitoring: boolean;
  };
  analytics?: {
    googleAnalyticsId?: string | undefined;
    enableDebugMode: boolean;
    enableAutoTracking: boolean;
    anonymizeIP: boolean;
  };
}

const resolveSampleRate = (value: number | undefined, fallback: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

export const monitoringConfig: MonitoringConfig = {
  sentry: {
    dsn: getEnvVar('NEXT_PUBLIC_SENTRY_DSN'),
    environment: getEnvVar('NEXT_PUBLIC_SENTRY_ENVIRONMENT'),
    tracesSampleRate: resolveSampleRate(parseNumberEnv('SENTRY_TRACES_SAMPLE_RATE', 0.1), 0.1),
    profilesSampleRate: resolveSampleRate(parseNumberEnv('SENTRY_PROFILES_SAMPLE_RATE', 0.1), 0.1),
    enablePerformanceMonitoring: parseBooleanEnv('SENTRY_ENABLE_PERFORMANCE', false),
  },
  analytics: {
    googleAnalyticsId: getEnvVar('NEXT_PUBLIC_GA_ID'),
    enableDebugMode: parseBooleanEnv('ANALYTICS_DEBUG_MODE', false),
    enableAutoTracking: parseBooleanEnv('ANALYTICS_AUTO_TRACKING', true),
    anonymizeIP: parseBooleanEnv('ANALYTICS_ANONYMIZE_IP', true),
  },
};
