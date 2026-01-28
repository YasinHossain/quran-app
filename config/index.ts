/**
 * Application Configuration
 *
 * Centralised entry point that composes individual configuration segments and
 * exposes them as a typed object.
 */
import { apiConfig, type ApiConfig } from './api';
import { appConfig, type AppConfig } from './app';
import { audioConfig, type AudioConfig } from './audio';
import { cacheConfig, type CacheConfig } from './cache';
import { featuresConfig, type FeaturesConfig } from './features';
import { loggingConfig, type LoggingConfig } from './logging';
import { monitoringConfig, type MonitoringConfig } from './monitoring';
import { searchConfig, type SearchConfig } from './search';
import { securityConfig, type SecurityConfig } from './security';
import { storageConfig, type StorageConfig } from './storage';
import { uiConfig, type UiConfig } from './ui';

export interface Config {
  app: AppConfig;
  api: ApiConfig;
  features: FeaturesConfig;
  cache: CacheConfig;
  storage: StorageConfig;
  audio: AudioConfig;
  ui: UiConfig;
  search: SearchConfig;
  security: SecurityConfig;
  monitoring: MonitoringConfig;
  logging: LoggingConfig;
}

const rawConfig: Config = {
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
 * Typed application configuration.
 *
 * Each configuration segment is responsible for normalising and defaulting its
 * values. Additional runtime warnings and assertions can be performed by
 * calling {@link validateConfig}.
 */
export const config: Config = rawConfig;

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
