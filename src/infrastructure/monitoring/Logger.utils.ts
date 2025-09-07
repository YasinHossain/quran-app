import { RemoteTransport } from './RemoteTransport';
import { LogLevel } from './types';
import { config } from '../../../config';

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
  const inBrowser = typeof window !== 'undefined' && typeof window.Error !== 'undefined';
  if (!inBrowser) return undefined;
  try {
    const stack = new Error().stack;
    if (!stack) return undefined;
    const lines = stack.split('\n');
    // Find the first line that's not from this logger
    for (let i = 3; i < lines.length; i++) {
      const line = lines[i];
      const isFromLogger = line?.includes('Logger.ts') || line?.includes('console.');
      if (line && !isFromLogger) return line.trim();
    }
  } catch {
    // Ignore errors in source detection
  }
  return undefined;
}
