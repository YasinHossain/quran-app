import { RemoteTransport, LogLevel, type LogEntry, logger } from '@infra/monitoring';

describe('RemoteTransport', () => {
  const createEntry = (level: LogLevel = LogLevel.INFO): LogEntry => ({
    level,
    message: 'msg',
    timestamp: new Date(),
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('flushes buffered logs to endpoint', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue({ ok: true } as Response);

    const transport = new RemoteTransport('https://example.com');
    const entry = createEntry();
    transport.log(entry);
    await transport.flush();

    expect(fetchMock).toHaveBeenCalled();
    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.entries).toHaveLength(1);

    transport.destroy();
  });

  it('flushes immediately on error level', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue({ ok: true } as Response);

    const transport = new RemoteTransport('https://example.com');
    transport.log(createEntry(LogLevel.ERROR));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fetchMock).toHaveBeenCalled();
    transport.destroy();
  });

  it('retries failed requests', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({ ok: true } as Response);
    const warnMock = jest.spyOn(logger, 'warn').mockImplementation(() => undefined);

    const transport = new RemoteTransport('https://example.com');
    transport.log(createEntry());
    await transport.flush();

    expect(warnMock).toHaveBeenCalled();

    await transport.flush();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const body = JSON.parse(fetchMock.mock.calls[1][1]?.body as string);
    expect(body.entries).toHaveLength(1);

    transport.destroy();
  });

  it('aborts long-running requests and retries', async () => {
    jest.useFakeTimers();
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockImplementationOnce((_url, options) => {
        return new Promise((_, reject) => {
          options?.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'));
          });
        });
      })
      .mockResolvedValueOnce({ ok: true } as Response);
    const warnMock = jest.spyOn(logger, 'warn').mockImplementation(() => undefined);

    const transport = new RemoteTransport('https://example.com');
    transport.log(createEntry());
    const flushPromise = transport.flush();

    jest.runAllTimers();
    await flushPromise;

    expect(warnMock).toHaveBeenCalled();

    await transport.flush();
    expect(fetchMock).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
    transport.destroy();
  });
});
