/**
 * @jest-environment node
 */

import { RemoteTransport } from '@infra/monitoring';

import { LogLevel, type LogEntry } from '@/src/infrastructure/monitoring/types';

describe('RemoteTransport flushing', () => {
  const createEntry = (level: LogLevel = LogLevel.INFO): LogEntry => ({
    level,
    message: 'msg',
    timestamp: new Date(),
  });

  let mockFetchWithTimeout: jest.MockedFunction<typeof import('@/lib/api/client').fetchWithTimeout>;

  beforeEach(() => {
    mockFetchWithTimeout = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('flushes buffered logs to endpoint', async () => {
    mockFetchWithTimeout.mockResolvedValue({ ok: true, status: 200 } as Response);

    const transport = new RemoteTransport(
      'https://example.com',
      {},
      { fetchWithTimeout: mockFetchWithTimeout }
    );
    const entry = createEntry();
    transport.log(entry);

    // Explicitly flush to trigger the fetch call
    await transport.flush();

    expect(mockFetchWithTimeout).toHaveBeenCalled();
    expect(mockFetchWithTimeout).toHaveBeenCalledWith(
      'https://example.com',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: expect.any(String),
      })
    );

    const body = JSON.parse(mockFetchWithTimeout.mock.calls[0][1]?.body as string);
    expect(body.entries).toHaveLength(1);
    transport.destroy();
  });

  it('flushes immediately on error level', async () => {
    mockFetchWithTimeout.mockResolvedValue({ ok: true, status: 200 } as Response);

    const transport = new RemoteTransport(
      'https://example.com',
      {},
      { fetchWithTimeout: mockFetchWithTimeout }
    );

    // Log an error entry which should trigger immediate flush
    transport.log(createEntry(LogLevel.ERROR));

    // Wait a tick for the async flush to complete
    await new Promise((resolve) => process.nextTick(resolve));

    expect(mockFetchWithTimeout).toHaveBeenCalled();
    expect(mockFetchWithTimeout).toHaveBeenCalledWith(
      'https://example.com',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(String),
      })
    );
    transport.destroy();
  });
});
