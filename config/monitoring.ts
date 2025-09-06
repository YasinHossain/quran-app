import { z } from 'zod';

import { getEnvVar, parseBooleanEnv, parseNumberEnv } from './utils';

/**
 * Monitoring configuration segment.
 *
 * Contains settings for error tracking and analytics providers.
 */
export const monitoringSchema = z.object({
  sentry: z
    .object({
      dsn: z.string().optional(),
      environment: z.string().optional(),
      tracesSampleRate: z.number().min(0).max(1).default(0.1),
      profilesSampleRate: z.number().min(0).max(1).default(0.1),
      enablePerformanceMonitoring: z.boolean().default(false),
    })
    .optional(),
  analytics: z
    .object({
      googleAnalyticsId: z.string().optional(),
      enableDebugMode: z.boolean().default(false),
      enableAutoTracking: z.boolean().default(true),
      anonymizeIP: z.boolean().default(true),
    })
    .optional(),
});

export type MonitoringConfig = z.infer<typeof monitoringSchema>;

export const monitoringConfig: MonitoringConfig = {
  sentry: {
    dsn: getEnvVar('NEXT_PUBLIC_SENTRY_DSN'),
    environment: getEnvVar('NEXT_PUBLIC_SENTRY_ENVIRONMENT'),
    tracesSampleRate: parseNumberEnv('SENTRY_TRACES_SAMPLE_RATE', 0.1)!,
    profilesSampleRate: parseNumberEnv('SENTRY_PROFILES_SAMPLE_RATE', 0.1)!,
    enablePerformanceMonitoring: parseBooleanEnv('SENTRY_ENABLE_PERFORMANCE', false),
  },
  analytics: {
    googleAnalyticsId: getEnvVar('NEXT_PUBLIC_GA_ID'),
    enableDebugMode: parseBooleanEnv('ANALYTICS_DEBUG_MODE', false),
    enableAutoTracking: parseBooleanEnv('ANALYTICS_AUTO_TRACKING', true),
    anonymizeIP: parseBooleanEnv('ANALYTICS_ANONYMIZE_IP', true),
  },
};
