/**
 * Application Configuration
 *
 * Centralised entry point that composes individual configuration segments and
 * validates them using Zod schemas.
 */
import { z } from 'zod';

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
export const config: Config = ((): Config => {
  try {
    return configSchema.parse(rawConfig);
  } catch (error) {
    let message = '❌ Configuration validation failed';

    if (error instanceof z.ZodError) {
      const details = error.issues
        .map((issue: z.ZodIssue) => `  - ${issue.path.join('.')}: ${issue.message}`)
        .join('\n');
      message += `\n${details}`;
    }

    throw new Error(message);
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
export function validateConfig(): string[] {
  const warnings: string[] = [];

  if (isProduction) {
    if (!config.monitoring.sentry?.dsn && config.features.enableErrorTracking) {
      warnings.push('⚠️  Error tracking is enabled but no Sentry DSN is configured');
    }

    if (!config.monitoring.analytics?.googleAnalyticsId && config.features.enableAnalytics) {
      warnings.push('⚠️  Analytics is enabled but no Google Analytics ID is configured');
    }
  }

  try {
    new URL(config.api.quranBaseUrl);
  } catch {
    throw new Error('Invalid Quran API base URL');
  }

  return warnings;
}

/**
 * Get configuration subset for client-side usage.
 *
 * Only returns configuration that's safe to expose to the browser.
 */
export type ClientConfig = {
  app: Pick<Config['app'], 'name' | 'version' | 'environment'>;
  api: Pick<Config['api'], 'quranBaseUrl' | 'timeout'>;
  features: Config['features'];
  ui: Config['ui'];
  audio: Config['audio'];
  search: Config['search'];
  cache: Pick<Config['cache'], 'ttl' | 'enableIndexedDBCache'>;
  storage: Pick<Config['storage'], 'enableIndexedDB' | 'enableLocalStorage'>;
};

export function getClientConfig(): ClientConfig {
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
