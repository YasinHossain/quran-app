/**
 * Application Configuration
 *
 * Centralized configuration management with Zod validation.
 * Ensures type safety and validates environment variables at startup.
 *
 * @see https://zod.dev/
 */

import { z } from 'zod';

import { logger } from 'src/infrastructure/monitoring/Logger';

/**
 * Environment validation schema
 */
const environmentSchema = z.enum(['development', 'staging', 'production', 'test']);

/**
 * Application configuration schema
 */
const configSchema = z.object({
  app: z.object({
    name: z.string().default('Quran App'),
    version: z.string().default('1.0.0'),
    environment: environmentSchema,
    port: z.number().int().min(1000).max(65535).default(3000),
  }),

  api: z.object({
    quranBaseUrl: z.string().url(),
    timeout: z.number().positive().default(30000), // 30 seconds
    retryAttempts: z.number().int().min(0).max(10).default(3),
    retryDelay: z.number().positive().default(1000), // 1 second base delay
  }),

  features: z.object({
    enableOfflineMode: z.boolean().default(false),
    enableAnalytics: z.boolean().default(false),
    enablePushNotifications: z.boolean().default(false),
    enableServiceWorker: z.boolean().default(true),
    enableErrorTracking: z.boolean().default(false),
    enablePerformanceMonitoring: z.boolean().default(false),
  }),

  cache: z.object({
    ttl: z.number().positive().default(300000), // 5 minutes
    maxSize: z.number().positive().default(50), // MB
    enableMemoryCache: z.boolean().default(true),
    enableIndexedDBCache: z.boolean().default(true),
    cachePrefix: z.string().default('quran-app-cache'),
  }),

  storage: z.object({
    enableIndexedDB: z.boolean().default(true),
    enableLocalStorage: z.boolean().default(true),
    storageQuota: z.number().positive().default(100), // MB
    autoCleanupDays: z.number().int().min(1).default(30),
  }),

  audio: z.object({
    defaultReciter: z.string().default('ar.alafasy'),
    enableAutoplay: z.boolean().default(false),
    enableBackground: z.boolean().default(false),
    bufferSize: z.number().positive().default(4096),
    crossfadeMs: z.number().int().min(0).default(200),
  }),

  ui: z.object({
    defaultTheme: z.enum(['light', 'dark', 'auto']).default('auto'),
    defaultFontSize: z.number().positive().default(16),
    enableAnimations: z.boolean().default(true),
    enableHaptics: z.boolean().default(false),
    animationDuration: z.number().positive().default(300),
  }),

  search: z.object({
    enableFuzzySearch: z.boolean().default(true),
    maxResults: z.number().int().min(1).max(1000).default(50),
    minQueryLength: z.number().int().min(1).default(3),
    highlightMatches: z.boolean().default(true),
  }),

  security: z.object({
    enableCSP: z.boolean().default(true),
    enableHTTPS: z.boolean().default(true),
    allowedOrigins: z.array(z.string()).default([]),
    rateLimitRequests: z.number().int().min(1).default(100),
    rateLimitWindow: z.number().int().min(1000).default(60000), // 1 minute
  }),

  monitoring: z.object({
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
  }),

  logging: z.object({
    level: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    enableConsole: z.boolean().default(true),
    enableFile: z.boolean().default(false),
    enableRemote: z.boolean().default(false),
    maxLogSize: z.number().positive().default(10), // MB
    rotateInterval: z.string().default('1d'), // 1 day
  }),
});

/**
 * Configuration type derived from schema
 */
export type Config = z.infer<typeof configSchema>;

/**
 * Get environment variable with fallback
 */
function getEnvVar(key: string, fallback?: string): string | undefined {
  const value = process.env[key];
  return value || fallback;
}

/**
 * Parse boolean from environment variable
 */
function parseBooleanEnv(key: string, fallback: boolean = false): boolean {
  const value = getEnvVar(key);
  if (!value) return fallback;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Parse number from environment variable
 */
function parseNumberEnv(key: string, fallback?: number): number | undefined {
  const value = getEnvVar(key);
  if (!value) return fallback;
  const parsed = Number(value);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Parse array from environment variable (comma-separated)
 */
function parseArrayEnv(key: string, fallback: string[] = []): string[] {
  const value = getEnvVar(key);
  if (!value) return fallback;
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Raw configuration from environment variables
 */
const rawConfig = {
  app: {
    name: getEnvVar('NEXT_PUBLIC_APP_NAME', 'Quran App'),
    version: getEnvVar('NEXT_PUBLIC_APP_VERSION', '1.0.0'),
    environment: getEnvVar('NODE_ENV', 'development') as
      | 'development'
      | 'staging'
      | 'production'
      | 'test',
    port: parseNumberEnv('PORT', 3000),
  },

  api: {
    quranBaseUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'https://api.quran.com/api/v4'),
    timeout: parseNumberEnv('API_TIMEOUT', 30000),
    retryAttempts: parseNumberEnv('API_RETRY_ATTEMPTS', 3),
    retryDelay: parseNumberEnv('API_RETRY_DELAY', 1000),
  },

  features: {
    enableOfflineMode: parseBooleanEnv('NEXT_PUBLIC_OFFLINE_MODE', false),
    enableAnalytics: parseBooleanEnv('NEXT_PUBLIC_ANALYTICS', false),
    enablePushNotifications: parseBooleanEnv('NEXT_PUBLIC_PUSH_NOTIFICATIONS', false),
    enableServiceWorker: !parseBooleanEnv('NEXT_DISABLE_PWA', false),
    enableErrorTracking: parseBooleanEnv('NEXT_PUBLIC_ERROR_TRACKING', false),
    enablePerformanceMonitoring: parseBooleanEnv('NEXT_PUBLIC_PERFORMANCE_MONITORING', false),
  },

  cache: {
    ttl: parseNumberEnv('CACHE_TTL', 300000),
    maxSize: parseNumberEnv('CACHE_MAX_SIZE', 50),
    enableMemoryCache: parseBooleanEnv('CACHE_ENABLE_MEMORY', true),
    enableIndexedDBCache: parseBooleanEnv('CACHE_ENABLE_INDEXEDDB', true),
    cachePrefix: getEnvVar('CACHE_PREFIX', 'quran-app-cache'),
  },

  storage: {
    enableIndexedDB: parseBooleanEnv('STORAGE_ENABLE_INDEXEDDB', true),
    enableLocalStorage: parseBooleanEnv('STORAGE_ENABLE_LOCALSTORAGE', true),
    storageQuota: parseNumberEnv('STORAGE_QUOTA_MB', 100),
    autoCleanupDays: parseNumberEnv('STORAGE_AUTO_CLEANUP_DAYS', 30),
  },

  audio: {
    defaultReciter: getEnvVar('NEXT_PUBLIC_DEFAULT_RECITER', 'ar.alafasy'),
    enableAutoplay: parseBooleanEnv('NEXT_PUBLIC_AUDIO_AUTOPLAY', false),
    enableBackground: parseBooleanEnv('NEXT_PUBLIC_AUDIO_BACKGROUND', false),
    bufferSize: parseNumberEnv('AUDIO_BUFFER_SIZE', 4096),
    crossfadeMs: parseNumberEnv('AUDIO_CROSSFADE_MS', 200),
  },

  ui: {
    defaultTheme: getEnvVar('NEXT_PUBLIC_DEFAULT_THEME', 'auto') as 'light' | 'dark' | 'auto',
    defaultFontSize: parseNumberEnv('NEXT_PUBLIC_DEFAULT_FONT_SIZE', 16),
    enableAnimations: parseBooleanEnv('NEXT_PUBLIC_ENABLE_ANIMATIONS', true),
    enableHaptics: parseBooleanEnv('NEXT_PUBLIC_ENABLE_HAPTICS', false),
    animationDuration: parseNumberEnv('UI_ANIMATION_DURATION', 300),
  },

  search: {
    enableFuzzySearch: parseBooleanEnv('SEARCH_ENABLE_FUZZY', true),
    maxResults: parseNumberEnv('SEARCH_MAX_RESULTS', 50),
    minQueryLength: parseNumberEnv('SEARCH_MIN_QUERY_LENGTH', 3),
    highlightMatches: parseBooleanEnv('SEARCH_HIGHLIGHT_MATCHES', true),
  },

  security: {
    enableCSP: parseBooleanEnv('SECURITY_ENABLE_CSP', true),
    enableHTTPS: parseBooleanEnv('SECURITY_ENABLE_HTTPS', true),
    allowedOrigins: parseArrayEnv('SECURITY_ALLOWED_ORIGINS', []),
    rateLimitRequests: parseNumberEnv('SECURITY_RATE_LIMIT_REQUESTS', 100),
    rateLimitWindow: parseNumberEnv('SECURITY_RATE_LIMIT_WINDOW', 60000),
  },

  monitoring: {
    sentry: {
      dsn: getEnvVar('NEXT_PUBLIC_SENTRY_DSN'),
      environment: getEnvVar('NEXT_PUBLIC_SENTRY_ENVIRONMENT'),
      tracesSampleRate: parseNumberEnv('SENTRY_TRACES_SAMPLE_RATE', 0.1),
      profilesSampleRate: parseNumberEnv('SENTRY_PROFILES_SAMPLE_RATE', 0.1),
      enablePerformanceMonitoring: parseBooleanEnv('SENTRY_ENABLE_PERFORMANCE', false),
    },
    analytics: {
      googleAnalyticsId: getEnvVar('NEXT_PUBLIC_GA_ID'),
      enableDebugMode: parseBooleanEnv('ANALYTICS_DEBUG_MODE', false),
      enableAutoTracking: parseBooleanEnv('ANALYTICS_AUTO_TRACKING', true),
      anonymizeIP: parseBooleanEnv('ANALYTICS_ANONYMIZE_IP', true),
    },
  },

  logging: {
    level: getEnvVar('LOG_LEVEL', 'info') as 'debug' | 'info' | 'warn' | 'error',
    enableConsole: parseBooleanEnv('LOG_ENABLE_CONSOLE', true),
    enableFile: parseBooleanEnv('LOG_ENABLE_FILE', false),
    enableRemote: parseBooleanEnv('LOG_ENABLE_REMOTE', false),
    maxLogSize: parseNumberEnv('LOG_MAX_SIZE_MB', 10),
    rotateInterval: getEnvVar('LOG_ROTATE_INTERVAL', '1d'),
  },
};

/**
 * Validated and typed configuration
 *
 * Throws error if configuration validation fails.
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

/**
 * Environment-specific configuration helpers
 */
export const isDevelopment = config.app.environment === 'development';
export const isProduction = config.app.environment === 'production';
export const isTest = config.app.environment === 'test';
export const isStaging = config.app.environment === 'staging';

/**
 * Feature flags helper
 */
export const features = config.features;

/**
 * Logging configuration helper
 */
export const shouldLog = (level: string): boolean => {
  const levels = { debug: 0, info: 1, warn: 2, error: 3 };
  const currentLevel = levels[config.logging.level as keyof typeof levels] ?? 1;
  const targetLevel = levels[level as keyof typeof levels] ?? 1;
  return targetLevel >= currentLevel;
};

/**
 * Validate configuration at startup
 *
 * Call this once during application initialization to ensure
 * all required configuration is present and valid.
 */
export function validateConfig(): void {
  logger.info(`✅ Configuration loaded for ${config.app.environment} environment`);

  // Log critical configuration warnings
  if (isProduction) {
    if (!config.monitoring.sentry?.dsn && config.features.enableErrorTracking) {
      logger.warn('⚠️  Error tracking is enabled but no Sentry DSN is configured');
    }

    if (!config.monitoring.analytics?.googleAnalyticsId && config.features.enableAnalytics) {
      logger.warn('⚠️  Analytics is enabled but no Google Analytics ID is configured');
    }
  }

  // Validate required URLs
  try {
    new URL(config.api.quranBaseUrl);
  } catch {
    throw new Error('Invalid Quran API base URL');
  }
}

/**
 * Get configuration subset for client-side usage
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
