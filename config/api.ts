import { z } from 'zod';

import { getEnvVar, parseNumberEnv } from './utils';

/**
 * API configuration segment.
 *
 * Centralises settings for external service communication.
 */
export const apiSchema = z.object({
  quranBaseUrl: z.string().url(),
  timeout: z.number().positive().default(30000),
  retryAttempts: z.number().int().min(0).max(10).default(3),
  retryDelay: z.number().positive().default(1000),
});

export type ApiConfig = z.infer<typeof apiSchema>;

export const apiConfig: ApiConfig = {
  quranBaseUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'https://api.quran.com/api/v4')!,
  timeout: parseNumberEnv('API_TIMEOUT', 30000)!,
  retryAttempts: parseNumberEnv('API_RETRY_ATTEMPTS', 3)!,
  retryDelay: parseNumberEnv('API_RETRY_DELAY', 1000)!,
};
