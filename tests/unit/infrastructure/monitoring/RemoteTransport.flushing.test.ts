import { RemoteTransport, LogLevel, type LogEntry } from '@infra/monitoring';

import { fetchWithTimeout } from '../../../../lib/api/client';

jest.mock('../../../../lib/api/client', () => ({
  fetchWithTimeout: jest.fn(),
}));

describe('RemoteTransport flushing', () => {
  const createEntry = (level: LogLevel = LogLevel.INFO): LogEntry => ({
    level,
    message: 'msg',
    timestamp: new Date(),
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('flushes buffered logs to endpoint', async () => {
    const fetchMock = fetchWithTimeout as jest.Mock;
    fetchMock.mockResolvedValue({ ok: true } as Response);

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
    const fetchMock = fetchWithTimeout as jest.Mock;
    fetchMock.mockResolvedValue({ ok: true } as Response);

    const transport = new RemoteTransport('https://example.com');
    transport.log(createEntry(LogLevel.ERROR));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fetchMock).toHaveBeenCalled();
    transport.destroy();
  });
});
