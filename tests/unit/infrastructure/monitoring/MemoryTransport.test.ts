import { MemoryTransport, LogLevel, type LogEntry } from '@infra/monitoring';

describe('MemoryTransport', () => {
  const createEntry = (message: string): LogEntry => ({
    level: LogLevel.INFO,
    message,
    timestamp: new Date(),
  });

  it('stores log entries up to max and clears correctly', () => {
    const transport = new MemoryTransport(2);
    transport.log(createEntry('one'));
    transport.log(createEntry('two'));
    transport.log(createEntry('three'));

    const entries = transport.getEntries();
    expect(entries).toHaveLength(2);
    expect(entries[0].message).toBe('two');
    expect(entries[1].message).toBe('three');

    transport.clear();
    expect(transport.getEntries()).toHaveLength(0);
  });
});
