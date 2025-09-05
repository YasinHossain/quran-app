import { RemoteErrorTracker, logger } from '@infra/monitoring';
import { fetchWithTimeout } from '../../../../lib/api/client';

jest.mock('../../../../lib/api/client', () => ({
  fetchWithTimeout: jest.fn(),
}));

describe('RemoteErrorTracker', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('flushes buffered events to endpoint', async () => {
    const fetchMock = fetchWithTimeout as jest.Mock;
    fetchMock.mockResolvedValue({ ok: true } as Response);

    const tracker = new RemoteErrorTracker('https://example.com');
    tracker.captureMessage('hello');
    await tracker.flush();

    expect(fetchMock).toHaveBeenCalled();
    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.events).toHaveLength(1);

    tracker.destroy();
  });

  it('retries failed requests', async () => {
    const fetchMock = fetchWithTimeout as jest.Mock;
    fetchMock
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({ ok: true } as Response);
    const warnMock = jest.spyOn(logger, 'warn').mockImplementation(() => undefined);

    const tracker = new RemoteErrorTracker('https://example.com');
    tracker.captureMessage('hello');
    await tracker.flush();

    expect(warnMock).toHaveBeenCalled();

    await tracker.flush();
    expect(fetchMock).toHaveBeenCalledTimes(2);

    tracker.destroy();
  });

  it('aborts long-running requests and retries', async () => {
    const fetchMock = fetchWithTimeout as jest.Mock;
    fetchMock
      .mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'))
      .mockResolvedValueOnce({ ok: true } as Response);
    const warnMock = jest.spyOn(logger, 'warn').mockImplementation(() => undefined);

    const tracker = new RemoteErrorTracker('https://example.com');
    tracker.captureMessage('hello');
    await tracker.flush();

    expect(warnMock).toHaveBeenCalled();

    await tracker.flush();
    expect(fetchMock).toHaveBeenCalledTimes(2);

    tracker.destroy();
  });
});

