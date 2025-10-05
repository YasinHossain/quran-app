import { type LogEntry, type ILoggerTransport } from './types';

/**
 * Memory transport for testing and debugging
 */
export class MemoryTransport implements ILoggerTransport {
  private entries: LogEntry[] = [];
  private maxEntries: number;

  constructor(maxEntries: number = 1000) {
    this.maxEntries = maxEntries;
  }

  log(entry: LogEntry): void {
    this.entries.push(entry);

    // Keep only the most recent entries
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }
  }

  getEntries(): LogEntry[] {
    return [...this.entries];
  }

  clear(): void {
    this.entries = [];
  }

  flush(): void {
    // Memory transport doesn't need flushing
  }
}
