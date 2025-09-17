import {
  prefetchAudioBatch,
  type AudioPrefetchItem,
  type AudioPrefetchResult,
} from '@/app/shared/player/utils/audioSegmentPrefetch.helpers';

import type { ILogger } from '@/src/domain/interfaces/ILogger';

const createLogger = (): Pick<ILogger, 'info'> => ({
  info: jest.fn<void, Parameters<ILogger['info']>>(),
});

const buildResultItems = (): AudioPrefetchItem[] => [
  { url: 'https://example.com/low.mp3', priority: 'low' },
  { url: 'https://example.com/high.mp3', priority: 'high' },
  { url: 'https://example.com/medium.mp3' },
];

const expectSampleResults = (results: AudioPrefetchResult[]): void => {
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
};

describe('prefetchAudioBatch concurrency', () => {
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

    const logger = createLogger();

    await prefetchAudioBatch({
      items,
      options: { maxConcurrent: 2, delayBetween: 0 },
      logger,
      prefetchAudioStart,
    });

    expect(prefetchAudioStart).toHaveBeenCalledTimes(items.length);
    expect(maxActive).toBe(2);
  });
});

describe('prefetchAudioBatch delays', () => {
  it('waits between batches based on the configured delay', async () => {
    jest.useFakeTimers();

    const items: AudioPrefetchItem[] = [
      { url: 'https://example.com/high.mp3', priority: 'high' },
      { url: 'https://example.com/medium.mp3', priority: 'medium' },
    ];

    const prefetchAudioStart = jest.fn(async () => true);
    const logger = createLogger();

    try {
      const runPromise = prefetchAudioBatch({
        items,
        options: { maxConcurrent: 1, delayBetween: 200 },
        logger,
        prefetchAudioStart,
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

describe('prefetchAudioBatch logging', () => {
  it('logs normalized options and priority distribution before execution', async () => {
    const items: AudioPrefetchItem[] = [
      { url: 'https://example.com/high.mp3', priority: 'high' },
      { url: 'https://example.com/low.mp3', priority: 'low' },
    ];

    const logger = createLogger();
    const prefetchAudioStart = jest.fn(async () => true);

    await prefetchAudioBatch({
      items,
      options: { maxConcurrent: 0, delayBetween: -50 },
      logger,
      prefetchAudioStart,
    });

    expect(logger.info).toHaveBeenCalledWith('Starting batch audio prefetch', {
      total: items.length,
      maxConcurrent: 1,
      delayBetween: 0,
      priorityDistribution: { high: 1, low: 1 },
    });
  });
});

describe('prefetchAudioBatch results', () => {
  it('invokes prefetchAudioStart respecting priority order', async () => {
    const logger = createLogger();
    const prefetchAudioStart = jest.fn(async () => true);

    await prefetchAudioBatch({
      items: buildResultItems(),
      options: { maxConcurrent: 2, delayBetween: 0 },
      logger,
      prefetchAudioStart,
    });

    expect(prefetchAudioStart.mock.calls.map(([callUrl]) => callUrl)).toEqual([
      'https://example.com/high.mp3',
      'https://example.com/medium.mp3',
      'https://example.com/low.mp3',
    ]);
  });

  it('returns aggregated results with duration metrics', async () => {
    const logger = createLogger();
    let callCount = 0;
    const nowSpy = jest.spyOn(performance, 'now').mockImplementation(() => {
      callCount += 1;
      return callCount * 5;
    });

    const prefetchAudioStart = jest
      .fn(async (url: string) => url !== 'https://example.com/low.mp3')
      .mockName('prefetchAudioStart');

    try {
      const results = await prefetchAudioBatch({
        items: buildResultItems(),
        options: { maxConcurrent: 2, delayBetween: 0 },
        logger,
        prefetchAudioStart,
      });

      expectSampleResults(results);
    } finally {
      nowSpy.mockRestore();
    }
  });
});
