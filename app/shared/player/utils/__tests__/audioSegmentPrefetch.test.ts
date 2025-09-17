import {
  runAudioBatchPrefetch,
  type AudioPrefetchItem,
} from '@/app/shared/player/utils/audioSegmentPrefetch.helpers';

describe('runAudioBatchPrefetch concurrency', () => {
  it('respects the maxConcurrent limit when batching requests', async () => {
    const items: AudioPrefetchItem[] = Array.from({ length: 5 }, (_, index) => ({
      url: `https://example.com/audio-${index}.mp3`,
      priority: index === 0 ? 'high' : 'medium',
    }));

    let active = 0;
    let maxActive = 0;

    const prefetchAudioStart = jest.fn(async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await Promise.resolve();
      active -= 1;
      return true;
    });

    await runAudioBatchPrefetch(items, prefetchAudioStart, {
      maxConcurrent: 2,
      delayBetween: 0,
    });

    expect(prefetchAudioStart).toHaveBeenCalledTimes(items.length);
    expect(maxActive).toBe(2);
  });
});

describe('runAudioBatchPrefetch delays', () => {
  it('waits between batches based on the configured delay', async () => {
    jest.useFakeTimers();

    const items: AudioPrefetchItem[] = [
      { url: 'https://example.com/high.mp3', priority: 'high' },
      { url: 'https://example.com/medium.mp3', priority: 'medium' },
    ];

    const prefetchAudioStart = jest.fn(async () => true);

    try {
      const runPromise = runAudioBatchPrefetch(items, prefetchAudioStart, {
        maxConcurrent: 1,
        delayBetween: 200,
      });

      await Promise.resolve();
      expect(prefetchAudioStart).toHaveBeenCalledTimes(1);

      await jest.advanceTimersByTimeAsync(199);
      await Promise.resolve();
      expect(prefetchAudioStart).toHaveBeenCalledTimes(1);

      await jest.advanceTimersByTimeAsync(1);
      await runPromise;

      expect(prefetchAudioStart).toHaveBeenCalledTimes(2);
    } finally {
      jest.useRealTimers();
    }
  });
});

describe('runAudioBatchPrefetch results', () => {
  it('returns aggregated results respecting priority ordering', async () => {
    const items: AudioPrefetchItem[] = [
      { url: 'https://example.com/low.mp3', priority: 'low' },
      { url: 'https://example.com/high.mp3', priority: 'high' },
      { url: 'https://example.com/medium.mp3' },
    ];

    let callCount = 0;
    const nowSpy = jest.spyOn(performance, 'now').mockImplementation(() => {
      callCount += 1;
      return callCount * 5;
    });

    const prefetchAudioStart = jest
      .fn(async (url: string) => url !== 'https://example.com/low.mp3')
      .mockName('prefetchAudioStart');

    try {
      const results = await runAudioBatchPrefetch(items, prefetchAudioStart, {
        maxConcurrent: 2,
        delayBetween: 0,
      });

      expect(results).toEqual([
        expect.objectContaining({
          url: 'https://example.com/high.mp3',
          success: true,
          size: 0,
        }),
        expect.objectContaining({
          url: 'https://example.com/medium.mp3',
          success: true,
          size: 0,
        }),
        expect.objectContaining({
          url: 'https://example.com/low.mp3',
          success: false,
          size: 0,
        }),
      ]);

      expect(results.every((result) => typeof result.duration === 'number')).toBe(true);
    } finally {
      nowSpy.mockRestore();
    }
  });
});
