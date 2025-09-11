import { config } from '@/config';

import { RemoteTransport } from './RemoteTransport';
import { LogLevel } from './types';

import type { Logger } from './Logger';

export function parseLogLevel(level: string): LogLevel {
  const levelMap: Record<string, LogLevel> = {
    debug: LogLevel.DEBUG,
    info: LogLevel.INFO,
    warn: LogLevel.WARN,
    error: LogLevel.ERROR,
  };
  return levelMap[level.toLowerCase()] ?? LogLevel.INFO;
}

export function setupDefaultTransports(logger: Logger): void {
  if (!config.logging.enableRemote) return;
  // Add remote transport if endpoint is configured
  const endpoint = process.env.LOG_ENDPOINT;
  const apiKey = process.env.LOG_API_KEY;
  if (endpoint) {
    logger.addTransport(new RemoteTransport(endpoint, { apiKey }));
  }
}

export function getSource(): string | undefined {
  // Early exit if not running in a browser-like environment
  if (typeof window === 'undefined' || typeof window.Error === 'undefined') return undefined;

  try {
    const stack = new Error().stack;
    if (!stack) return undefined;

    const isInternalFrame = (line: string): boolean =>
      line.includes('Logger.') || line.includes('Logger.ts') || line.includes('console.');

    // Skip the first few frames (Error line + current util) and pick the first external frame
    return stack
      .split('\n')
      .slice(3)
      .map((l) => l.trim())
      .find((l) => l && !isInternalFrame(l));
  } catch {
    // Ignore errors in source detection
    return undefined;
  }
}
