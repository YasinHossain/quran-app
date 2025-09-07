/**
 * Application Configuration
 *
 * Centralised entry point that composes individual configuration segments and
 * validates them using Zod schemas.
 */
import { z } from 'zod';

import { logger } from '@/src/infrastructure/monitoring/Logger';

import { apiConfig, apiSchema } from './api';
import { appConfig, appSchema } from './app';
import { audioConfig, audioSchema } from './audio';
import { cacheConfig, cacheSchema } from './cache';
import { featuresConfig, featuresSchema } from './features';
import { loggingConfig, loggingSchema } from './logging';
import { monitoringConfig, monitoringSchema } from './monitoring';
import { searchConfig, searchSchema } from './search';
import { securityConfig, securitySchema } from './security';
import { storageConfig, storageSchema } from './storage';
import { uiConfig, uiSchema } from './ui';

const configSchema = z.object({
  app: appSchema,
  api: apiSchema,
  features: featuresSchema,
  cache: cacheSchema,
  storage: storageSchema,
  audio: audioSchema,
  ui: uiSchema,
  search: searchSchema,
  security: securitySchema,
  monitoring: monitoringSchema,
  logging: loggingSchema,
});

export type Config = z.infer<typeof configSchema>;

const rawConfig = {
  app: appConfig,
  api: apiConfig,
  features: featuresConfig,
  cache: cacheConfig,
  storage: storageConfig,
  audio: audioConfig,
  ui: uiConfig,
  search: searchConfig,
  security: securityConfig,
  monitoring: monitoringConfig,
  logging: loggingConfig,
};

/**
 * Validated and typed configuration.
 *
 * Throws an error if configuration validation fails.
 */
export const config: Config = (() => {
  try {
    return configSchema.parse(rawConfig);
  } catch (error) {
    logger.error('❌ Configuration validation failed:', undefined, error as Error);

    if (error instanceof z.ZodError) {
        logger.error('Configuration errors:');
      error.errors.forEach((err) => {
        logger.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }

    throw new Error('Invalid application configuration. Please check your environment variables.');
  }
})();

/** Environment helpers */
export const isDevelopment = config.app.environment === 'development';
export const isProduction = config.app.environment === 'production';
export const isTest = config.app.environment === 'test';
export const isStaging = config.app.environment === 'staging';

/** Feature flags helper */
export const features = config.features;

/**
 * Logging configuration helper
 */
export const shouldLog = (level: string): boolean => {
  const levels = { debug: 0, info: 1, warn: 2, error: 3 } as const;
  const currentLevel = levels[config.logging.level as keyof typeof levels] ?? 1;
  const targetLevel = levels[level as keyof typeof levels] ?? 1;
  return targetLevel >= currentLevel;
};

/**
 * Validate configuration at startup.
 *
 * Call this during application initialisation to ensure all required
 * configuration is present and valid.
 */
export function validateConfig(): void {

  if (isProduction) {
    if (!config.monitoring.sentry?.dsn && config.features.enableErrorTracking) {
        logger.warn('⚠️  Error tracking is enabled but no Sentry DSN is configured');
    }

    if (!config.monitoring.analytics?.googleAnalyticsId && config.features.enableAnalytics) {
        logger.warn('⚠️  Analytics is enabled but no Google Analytics ID is configured');
    }
  }

  try {
    new URL(config.api.quranBaseUrl);
  } catch {
    throw new Error('Invalid Quran API base URL');
  }
}

/**
 * Get configuration subset for client-side usage.
 *
 * Only returns configuration that's safe to expose to the browser.
 */
export function getClientConfig() {
  return {
    app: {
      name: config.app.name,
      version: config.app.version,
      environment: config.app.environment,
    },
    api: {
      quranBaseUrl: config.api.quranBaseUrl,
      timeout: config.api.timeout,
    },
    features: config.features,
    ui: config.ui,
    audio: config.audio,
    search: config.search,
    cache: {
      ttl: config.cache.ttl,
      enableIndexedDBCache: config.cache.enableIndexedDBCache,
    },
    storage: {
      enableIndexedDB: config.storage.enableIndexedDB,
      enableLocalStorage: config.storage.enableLocalStorage,
    },
  };
}
