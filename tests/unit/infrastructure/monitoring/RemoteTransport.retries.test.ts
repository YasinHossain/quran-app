/**
 * @jest-environment node
 */

import { RemoteTransport, LogLevel, type LogEntry } from '@infra/monitoring';

describe('RemoteTransport retries', () => {
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

  it('retries failed requests', async () => {
    mockFetchWithTimeout
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({ ok: true, status: 200 } as Response);

    const transport = new RemoteTransport(
      'https://example.com',
      {},
      { fetchWithTimeout: mockFetchWithTimeout }
    );
    transport.log(createEntry());

    // First flush should fail and entries should be re-added to buffer
    await transport.flush();
    expect(mockFetchWithTimeout).toHaveBeenCalledTimes(1);

    // Second flush should succeed with retry
    await transport.flush();
    expect(mockFetchWithTimeout).toHaveBeenCalledTimes(2);
    const body = JSON.parse(mockFetchWithTimeout.mock.calls[1][1]?.body as string);
    expect(body.entries).toHaveLength(1);
    transport.destroy();
  });

  it('aborts long-running requests and retries', async () => {
    mockFetchWithTimeout
      .mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'))
      .mockResolvedValueOnce({ ok: true, status: 200 } as Response);

    const transport = new RemoteTransport(
      'https://example.com',
      {},
      { fetchWithTimeout: mockFetchWithTimeout }
    );
    transport.log(createEntry());

    // First flush should fail with AbortError and entries should be re-added to buffer
    await transport.flush();
    expect(mockFetchWithTimeout).toHaveBeenCalledTimes(1);

    // Second flush should succeed with retry
    await transport.flush();
    expect(mockFetchWithTimeout).toHaveBeenCalledTimes(2);
    transport.destroy();
  });
});
