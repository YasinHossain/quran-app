import { ConsoleTransport } from './ConsoleTransport';
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
  if (config.logging.enableConsole) {
    logger.addTransport(new ConsoleTransport());
  }

  if (config.logging.enableRemote) {
    // Add remote transport if endpoint is configured
    const endpoint = process.env.LOG_ENDPOINT;
    const apiKey = process.env.LOG_API_KEY;

    if (endpoint) {
      logger.addTransport(new RemoteTransport(endpoint, { apiKey }));
    }
  }
}

export function getSource(): string | undefined {
  if (typeof window !== 'undefined' && window.Error) {
    try {
      const stack = new Error().stack;
      if (stack) {
        const lines = stack.split('\n');
        // Find the first line that's not from this logger
        for (let i = 3; i < lines.length; i++) {
          const line = lines[i];
          if (line && !line.includes('Logger.ts') && !line.includes('console.')) {
            return line.trim();
          }
        }
      }
    } catch {
      // Ignore errors in source detection
    }
  }
  return undefined;
}
