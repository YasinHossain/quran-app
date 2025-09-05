import { ConsoleTransport, LogLevel, type LogEntry } from '@infra/monitoring';

describe('ConsoleTransport', () => {
  it('formats log entry and calls appropriate console method', () => {
    const transport = new ConsoleTransport();
    const entry: LogEntry = {
      level: LogLevel.INFO,
      message: 'hello',
      timestamp: new Date('2023-01-01T00:00:00.000Z'),
    };

    const spy = jest.spyOn(console, 'info').mockImplementation(() => {});

    transport.log(entry);

    expect(spy).toHaveBeenCalledWith('[2023-01-01T00:00:00.000Z] [INFO] hello', undefined);

    spy.mockRestore();
  });
});
