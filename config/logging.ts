import { getEnvVar, parseBooleanEnv, parseNumberEnv } from './utils';

/**
 * Logging configuration segment.
 *
 * Controls log verbosity and transport options.
 */
export type LoggingLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LoggingConfig {
  level: LoggingLevel;
  enableConsole: boolean;
  enableFile: boolean;
  enableRemote: boolean;
  maxLogSize: number;
  rotateInterval: string;
}

const resolveLevel = (value: string | undefined): LoggingLevel => {
  switch (value) {
    case 'debug':
    case 'info':
    case 'warn':
    case 'error':
      return value;
    default:
      return 'info';
  }
};

const resolvePositiveNumber = (value: number | undefined, fallback: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return fallback;
  return value;
};

export const loggingConfig: LoggingConfig = {
  level: resolveLevel(getEnvVar('LOG_LEVEL', 'info')),
  enableConsole: parseBooleanEnv('LOG_ENABLE_CONSOLE', true),
  enableFile: parseBooleanEnv('LOG_ENABLE_FILE', false),
  enableRemote: parseBooleanEnv('LOG_ENABLE_REMOTE', false),
  maxLogSize: resolvePositiveNumber(parseNumberEnv('LOG_MAX_SIZE_MB', 10), 10),
  rotateInterval: getEnvVar('LOG_ROTATE_INTERVAL', '1d') ?? '1d',
};
