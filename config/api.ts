import { getEnvVar, parseNumberEnv } from './utils';

/**
 * API configuration segment.
 *
 * Centralises settings for external service communication.
 */
export interface ApiConfig {
  quranBaseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export const apiConfig: ApiConfig = {
  quranBaseUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'https://api.quran.com/api/v4')!,
  timeout: parseNumberEnv('API_TIMEOUT', 30000)!,
  retryAttempts: parseNumberEnv('API_RETRY_ATTEMPTS', 3)!,
  retryDelay: parseNumberEnv('API_RETRY_DELAY', 1000)!,
};
