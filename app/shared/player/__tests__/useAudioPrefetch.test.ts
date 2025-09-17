import { act, renderHook } from '@testing-library/react';

import { useAudioPrefetch } from '@/app/shared/player/hooks/useAudioPrefetch';

jest.mock('@/src/infrastructure/monitoring/Logger', () => ({
  logger: {
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

const AUDIO_URL = 'https://audio.example/test.mp3';

const originalFetch = globalThis.fetch;
const OriginalAbortController = globalThis.AbortController;
const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;
const createObjectUrlMock = jest.fn(() => 'object-url');
const revokeObjectUrlMock = jest.fn();

type PrefetchMocks = {
  fetchMock: jest.Mock;
  abortMock: jest.Mock;
  createObjectUrlMock: jest.Mock;
  revokeObjectUrlMock: jest.Mock;
  blob: Blob;
};

function applyPrefetchMocks(): PrefetchMocks {
  const abortMock = jest.fn();
  class MockAbortController {
    public readonly signal = {} as AbortSignal;
    public abort = abortMock;
  }
  (globalThis as typeof globalThis & { AbortController: typeof AbortController }).AbortController =
    MockAbortController as unknown as typeof AbortController;

  const blob = new Blob(['audio-data'], { type: 'audio/mpeg' });
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    blob: jest.fn().mockResolvedValue(blob),
  });
  globalThis.fetch = fetchMock as unknown as typeof fetch;

  createObjectUrlMock.mockClear();
  createObjectUrlMock.mockReturnValue('object-url');
  revokeObjectUrlMock.mockClear();
  (URL as unknown as { createObjectURL: typeof URL.createObjectURL }).createObjectURL =
    createObjectUrlMock as unknown as typeof URL.createObjectURL;
  (URL as unknown as { revokeObjectURL: typeof URL.revokeObjectURL }).revokeObjectURL =
    revokeObjectUrlMock as unknown as typeof URL.revokeObjectURL;

  return { fetchMock, abortMock, createObjectUrlMock, revokeObjectUrlMock, blob };
}

function restorePrefetchMocks(): void {
  globalThis.fetch = originalFetch;
  if (OriginalAbortController) {
    globalThis.AbortController = OriginalAbortController;
  } else {
    delete (globalThis as typeof globalThis & { AbortController?: typeof AbortController })
      .AbortController;
  }
}

function runPrefetchMissTest(getMocks: () => PrefetchMocks): void {
  it('prefetches and caches audio on cache miss', async () => {
    const { result } = renderHook(() => useAudioPrefetch(null));

    let objectUrl: string | null = null;
    await act(async () => {
      objectUrl = await result.current.prefetchAudio(AUDIO_URL);
    });

    const mocks = getMocks();
    expect(mocks.fetchMock).toHaveBeenCalledWith(
      AUDIO_URL,
      expect.objectContaining({
        headers: { Range: 'bytes=0-1024' },
        signal: expect.any(Object),
      })
    );
    expect(mocks.createObjectUrlMock).toHaveBeenCalledWith(mocks.blob);
    expect(objectUrl).toBe('object-url');
    expect(result.current.getPrefetchedUrl(AUDIO_URL)).toBe('object-url');
    expect(mocks.abortMock).not.toHaveBeenCalled();
  });
}

function runCacheHitTest(getMocks: () => PrefetchMocks): void {
  it('returns cached audio without refetching on cache hit', async () => {
    const { result } = renderHook(() => useAudioPrefetch(null));

    await act(async () => {
      await result.current.prefetchAudio(AUDIO_URL);
    });

    const mocks = getMocks();
    mocks.fetchMock.mockClear();
    mocks.createObjectUrlMock.mockClear();

    let cachedUrl: string | null = null;
    await act(async () => {
      cachedUrl = await result.current.prefetchAudio(AUDIO_URL);
    });

    expect(mocks.fetchMock).not.toHaveBeenCalled();
    expect(mocks.createObjectUrlMock).not.toHaveBeenCalled();
    expect(cachedUrl).toBe('object-url');
  });
}

function runCleanupTest(getMocks: () => PrefetchMocks): void {
  it('cleans up cached audio on unmount', async () => {
    const { result, unmount } = renderHook(() => useAudioPrefetch(null));

    await act(async () => {
      await result.current.prefetchAudio(AUDIO_URL);
    });

    unmount();
    expect(getMocks().revokeObjectUrlMock).toHaveBeenCalledWith('object-url');
  });
}

describe('useAudioPrefetch', () => {
  let mocks: PrefetchMocks;

  beforeEach(() => {
    mocks = applyPrefetchMocks();
  });

  afterEach(() => {
    restorePrefetchMocks();
    jest.clearAllMocks();
  });

  const getMocks = (): PrefetchMocks => mocks;
  runPrefetchMissTest(getMocks);
  runCacheHitTest(getMocks);
  runCleanupTest(getMocks);
});

afterAll(() => {
  if (originalCreateObjectURL) {
    URL.createObjectURL = originalCreateObjectURL;
  } else {
    delete (URL as { createObjectURL?: typeof URL.createObjectURL }).createObjectURL;
  }

  if (originalRevokeObjectURL) {
    URL.revokeObjectURL = originalRevokeObjectURL;
  } else {
    delete (URL as { revokeObjectURL?: typeof URL.revokeObjectURL }).revokeObjectURL;
  }
});
