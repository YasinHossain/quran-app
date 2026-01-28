import { getEnvVar, parseNumberEnv } from './utils';

/**
 * Application configuration segment.
 *
 * Handles general application settings such as name, version and runtime
 * environment.
 */
export type AppEnvironment = 'development' | 'staging' | 'production' | 'test';

export interface AppConfig {
  name: string;
  version: string;
  environment: AppEnvironment;
  port: number;
}

const resolveEnvironment = (value: string | undefined): AppEnvironment => {
  switch (value) {
    case 'development':
    case 'staging':
    case 'production':
    case 'test':
      return value;
    default:
      return 'development';
  }
};

export const appConfig: AppConfig = {
  name: getEnvVar('NEXT_PUBLIC_APP_NAME', 'Quran App')!,
  version: getEnvVar('NEXT_PUBLIC_APP_VERSION', '1.0.0')!,
  environment: resolveEnvironment(getEnvVar('NODE_ENV', 'development')),
  port: parseNumberEnv('PORT', 3000)!,
};
