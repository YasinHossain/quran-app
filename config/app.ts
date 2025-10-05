import { z } from 'zod';

import { getEnvVar, parseNumberEnv } from './utils';

/**
 * Application configuration segment.
 *
 * Handles general application settings such as name, version and runtime
 * environment.
 */
export const environmentSchema = z.enum(['development', 'staging', 'production', 'test']);

export const appSchema = z.object({
  name: z.string().default('Quran App'),
  version: z.string().default('1.0.0'),
  environment: environmentSchema,
  port: z.number().int().min(1000).max(65535).default(3000),
});

export type AppConfig = z.infer<typeof appSchema>;

export const appConfig: AppConfig = {
  name: getEnvVar('NEXT_PUBLIC_APP_NAME', 'Quran App')!,
  version: getEnvVar('NEXT_PUBLIC_APP_VERSION', '1.0.0')!,
  environment: (getEnvVar('NODE_ENV', 'development') as AppConfig['environment'])!,
  port: parseNumberEnv('PORT', 3000)!,
};
