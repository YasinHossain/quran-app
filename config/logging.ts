import { z } from 'zod';

import { getEnvVar, parseBooleanEnv, parseNumberEnv } from './utils';

/**
 * Logging configuration segment.
 *
 * Controls log verbosity and transport options.
 */
export const loggingSchema = z.object({
  level: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  enableConsole: z.boolean().default(true),
  enableFile: z.boolean().default(false),
  enableRemote: z.boolean().default(false),
  maxLogSize: z.number().positive().default(10),
  rotateInterval: z.string().default('1d'),
});

export type LoggingConfig = z.infer<typeof loggingSchema>;

export const loggingConfig: LoggingConfig = {
  level: (getEnvVar('LOG_LEVEL', 'info') as LoggingConfig['level'])!,
  enableConsole: parseBooleanEnv('LOG_ENABLE_CONSOLE', true),
  enableFile: parseBooleanEnv('LOG_ENABLE_FILE', false),
  enableRemote: parseBooleanEnv('LOG_ENABLE_REMOTE', false),
  maxLogSize: parseNumberEnv('LOG_MAX_SIZE_MB', 10)!,
  rotateInterval: getEnvVar('LOG_ROTATE_INTERVAL', '1d')!,
};
