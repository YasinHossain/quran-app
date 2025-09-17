/**
 * @jest-environment node
 */

import { RemoteTransport } from '@infra/monitoring';

import { LogLevel, type LogEntry } from '@/src/infrastructure/monitoring/types';

type FetchWithTimeout = typeof import('@/lib/api/client').fetchWithTimeout;

const createEntry = (level: LogLevel = LogLevel.INFO): LogEntry => ({
  level,
  message: 'msg',
  timestamp: new Date(),
});

const setupTransportMocks = () => {
  let transport: RemoteTransport | undefined;
  let mockFetchWithTimeout: jest.MockedFunction<FetchWithTimeout> | undefined;

  beforeEach(() => {
    mockFetchWithTimeout = jest.fn() as jest.MockedFunction<FetchWithTimeout>;
    transport = new RemoteTransport(
      'https://example.com',
      {},
      { fetchWithTimeout: mockFetchWithTimeout }
    );
  });

  afterEach(() => {
    transport?.destroy();
    jest.restoreAllMocks();
  });

  return () => {
    if (!transport || !mockFetchWithTimeout) {
      throw new Error('Transport mocks not initialized');
    }

    return { transport, mockFetchWithTimeout };
  };
};

const expectSuccessfulFlush = (
  mockFetchWithTimeout: jest.MockedFunction<FetchWithTimeout>,
  { includeHeaders = false, entries = 1 }: { includeHeaders?: boolean; entries?: number } = {}
) => {
  expect(mockFetchWithTimeout).toHaveBeenCalled();

  const [, requestInit] = mockFetchWithTimeout.mock.calls[0] ?? [];

  if (!requestInit) {
    throw new Error('Expected fetchWithTimeout to be called with a RequestInit payload');
  }

  expect(requestInit).toEqual(
    expect.objectContaining({
      method: 'POST',
      body: expect.any(String),
    })
  );

  if (includeHeaders) {
    expect(requestInit.headers).toEqual(
      expect.objectContaining({
        'Content-Type': 'application/json',
      })
    );
  }

  if (entries !== undefined) {
    const { body } = requestInit;

    if (typeof body !== 'string') {
      throw new Error('Expected fetchWithTimeout to be called with a string body');
    }

    const parsedBody = JSON.parse(body);
    expect(parsedBody.entries).toHaveLength(entries);
  }
};

describe('RemoteTransport flushing', () => {
  const getContext = setupTransportMocks();

  it('flushes buffered logs to endpoint', async () => {
    const { transport, mockFetchWithTimeout } = getContext();
    mockFetchWithTimeout.mockResolvedValue({ ok: true, status: 200 } as Response);

    const entry = createEntry();
    transport.log(entry);

    // Explicitly flush to trigger the fetch call
    await transport.flush();

    expectSuccessfulFlush(mockFetchWithTimeout, { includeHeaders: true, entries: 1 });
  });

  it('flushes immediately on error level', async () => {
    const { transport, mockFetchWithTimeout } = getContext();
    mockFetchWithTimeout.mockResolvedValue({ ok: true, status: 200 } as Response);

    // Log an error entry which should trigger immediate flush
    transport.log(createEntry(LogLevel.ERROR));

    // Wait a tick for the async flush to complete
    await new Promise((resolve) => process.nextTick(resolve));

    expectSuccessfulFlush(mockFetchWithTimeout, { entries: 1 });
  });
});
