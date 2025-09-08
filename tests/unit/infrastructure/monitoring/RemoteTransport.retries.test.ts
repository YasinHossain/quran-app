import { RemoteTransport, LogLevel, type LogEntry, logger } from '@infra/monitoring';

import { fetchWithTimeout } from '@/lib/api/client';

jest.mock('../../../../lib/api/client', () => ({
  fetchWithTimeout: jest.fn(),
}));

describe('RemoteTransport retries', () => {
  const createEntry = (level: LogLevel = LogLevel.INFO): LogEntry => ({
    level,
    message: 'msg',
    timestamp: new Date(),
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('retries failed requests', async () => {
    const fetchMock = fetchWithTimeout as jest.Mock;
    fetchMock
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
    const fetchMock = fetchWithTimeout as jest.Mock;
    fetchMock
      .mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'))
      .mockResolvedValueOnce({ ok: true } as Response);
    const warnMock = jest.spyOn(logger, 'warn').mockImplementation(() => undefined);

    const transport = new RemoteTransport('https://example.com');
    transport.log(createEntry());
    await transport.flush();

    expect(warnMock).toHaveBeenCalled();
    await transport.flush();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    transport.destroy();
  });
});
