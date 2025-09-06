import { LogLevel, type LogEntry, type ILoggerTransport } from './types';

/**
 * Console transport implementation
 */
export class ConsoleTransport implements ILoggerTransport {
  log(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    const prefix = `[${timestamp}] [${levelName}]`;

    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    const fullMessage = `${prefix} ${entry.message}${contextStr}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(fullMessage, entry.error);
        break;
      case LogLevel.INFO:
        console.info(fullMessage, entry.error);
        break;
      case LogLevel.WARN:
        console.warn(fullMessage, entry.error);
        break;
      case LogLevel.ERROR:
        console.error(fullMessage, entry.error);
        break;
    }
  }
}
