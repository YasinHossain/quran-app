import { z } from 'zod';
import { logger } from '@/src/infrastructure/monitoring/Logger';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // API Configuration
  NEXT_PUBLIC_API_URL: z.string().url().default('https://api.quran.com/api/v4'),
  NEXT_PUBLIC_AUDIO_CDN_URL: z.string().url().default('https://verses.quran.com'),
  NEXT_PUBLIC_IMAGE_CDN_URL: z.string().url().default('https://cdn.quran.com'),

  // Cache Configuration
  CACHE_TTL: z.string().default('3600').transform(Number),
  ENABLE_OFFLINE_MODE: z
    .string()
    .default('true')
    .transform((v) => v === 'true'),

  // Logging Configuration
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  ENABLE_CONSOLE_LOGGING: z
    .string()
    .default('true')
    .transform((v) => v === 'true'),

  // Performance Configuration
  ENABLE_ANALYTICS: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),
  API_TIMEOUT: z.string().default('10000').transform(Number),

  // Feature Flags
  ENABLE_TAFSIR: z
    .string()
    .default('true')
    .transform((v) => v === 'true'),
  ENABLE_BOOKMARKS: z
    .string()
    .default('true')
    .transform((v) => v === 'true'),
  ENABLE_SEARCH: z
    .string()
    .default('true')
    .transform((v) => v === 'true'),
  ENABLE_AUDIO: z
    .string()
    .default('true')
    .transform((v) => v === 'true'),
});

export type Config = z.infer<typeof envSchema>;

let config: Config;

try {
  config = envSchema.parse(process.env);
} catch (error) {
  logger.error('❌ Invalid environment configuration:', undefined, error as Error);

  // Provide fallback configuration in case of validation errors
  config = {
    NODE_ENV: 'development',
    NEXT_PUBLIC_API_URL: 'https://api.quran.com/api/v4',
    NEXT_PUBLIC_AUDIO_CDN_URL: 'https://verses.quran.com',
    NEXT_PUBLIC_IMAGE_CDN_URL: 'https://cdn.quran.com',
    CACHE_TTL: 3600,
    ENABLE_OFFLINE_MODE: true,
    LOG_LEVEL: 'info',
    ENABLE_CONSOLE_LOGGING: true,
    ENABLE_ANALYTICS: false,
    API_TIMEOUT: 10000,
    ENABLE_TAFSIR: true,
    ENABLE_BOOKMARKS: true,
    ENABLE_SEARCH: true,
    ENABLE_AUDIO: true,
  } as Config;
}

export { config };

// Helper functions for environment checks
export const isDevelopment = () => config.NODE_ENV === 'development';
export const isProduction = () => config.NODE_ENV === 'production';
export const isTest = () => config.NODE_ENV === 'test';

// Feature flag helpers
export const isFeatureEnabled = (
  feature: keyof Pick<
    Config,
    'ENABLE_TAFSIR' | 'ENABLE_BOOKMARKS' | 'ENABLE_SEARCH' | 'ENABLE_AUDIO' | 'ENABLE_ANALYTICS'
  >
): boolean => {
  return config[feature];
};
