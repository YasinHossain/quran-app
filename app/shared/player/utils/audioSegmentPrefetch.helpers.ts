import type { ILogger } from '@/src/domain/interfaces/ILogger';

export type AudioPrefetchPriority = 'high' | 'medium' | 'low';

export interface AudioPrefetchItem {
  url: string;
  priority?: AudioPrefetchPriority;
}

export interface AudioPrefetchResult {
  url: string;
  success: boolean;
  size: number;
  duration: number;
}

export interface RunAudioBatchPrefetchOptions {
  maxConcurrent?: number;
  delayBetween?: number;
}

export type NormalizedRunAudioBatchPrefetchOptions = Required<RunAudioBatchPrefetchOptions>;

const DEFAULT_BATCH_OPTIONS: NormalizedRunAudioBatchPrefetchOptions = Object.freeze({
  maxConcurrent: 3,
  delayBetween: 100,
});

const PRIORITY_ORDER: Record<AudioPrefetchPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function getPriorityDistribution(items: AudioPrefetchItem[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    const priority = item.priority || 'medium';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {});
}

export function normalizeRunAudioBatchPrefetchOptions(
  options: RunAudioBatchPrefetchOptions = {}
): NormalizedRunAudioBatchPrefetchOptions {
  const {
    maxConcurrent = DEFAULT_BATCH_OPTIONS.maxConcurrent,
    delayBetween = DEFAULT_BATCH_OPTIONS.delayBetween,
  } = options;

  return {
    maxConcurrent: Math.max(1, Math.floor(maxConcurrent)),
    delayBetween: Math.max(0, delayBetween),
  } satisfies NormalizedRunAudioBatchPrefetchOptions;
}

export function sortAudioPrefetchItemsByPriority(items: AudioPrefetchItem[]): AudioPrefetchItem[] {
  return [...items].sort(
    (a, b) => PRIORITY_ORDER[a.priority || 'medium'] - PRIORITY_ORDER[b.priority || 'medium']
  );
}

export function createAudioPrefetchBatches(
  items: AudioPrefetchItem[],
  maxConcurrent: number
): AudioPrefetchItem[][] {
  if (items.length === 0) {
    return [];
  }

  const batches: AudioPrefetchItem[][] = [];
  for (let index = 0; index < items.length; index += maxConcurrent) {
    batches.push(items.slice(index, index + maxConcurrent));
  }

  return batches;
}

export function waitForNextAudioBatch(delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export function logAudioBatchPrefetchStart(
  logger: Pick<ILogger, 'info'>,
  items: AudioPrefetchItem[],
  options: NormalizedRunAudioBatchPrefetchOptions
): void {
  logger.info('Starting batch audio prefetch', {
    total: items.length,
    maxConcurrent: options.maxConcurrent,
    delayBetween: options.delayBetween,
    priorityDistribution: getPriorityDistribution(items),
  });
}

export async function runAudioBatchPrefetch(
  items: AudioPrefetchItem[],
  prefetchAudioStart: (url: string, opts: { priority?: AudioPrefetchPriority }) => Promise<boolean>,
  options: RunAudioBatchPrefetchOptions = {}
): Promise<AudioPrefetchResult[]> {
  const normalizedOptions = normalizeRunAudioBatchPrefetchOptions(options);
  const sortedItems = sortAudioPrefetchItemsByPriority(items);
  const batches = createAudioPrefetchBatches(sortedItems, normalizedOptions.maxConcurrent);
  const results: AudioPrefetchResult[] = [];

  for (let index = 0; index < batches.length; index += 1) {
    const batch = batches[index] ?? [];
    const batchResults = await Promise.all(
      batch.map(async (item) => {
        const startTime = performance.now();
        const success = await prefetchAudioStart(
          item.url,
          item.priority ? { priority: item.priority } : {}
        );
        const duration = performance.now() - startTime;

        return {
          url: item.url,
          success,
          size: 0,
          duration,
        } satisfies AudioPrefetchResult;
      })
    );

    results.push(...batchResults);

    const hasMoreItems = index < batches.length - 1;
    if (hasMoreItems && normalizedOptions.delayBetween > 0) {
      await waitForNextAudioBatch(normalizedOptions.delayBetween);
    }
  }

  return results;
}

export async function prefetchAudioBatch({
  items,
  options,
  logger,
  prefetchAudioStart,
}: {
  items: AudioPrefetchItem[];
  options?: RunAudioBatchPrefetchOptions;
  logger: Pick<ILogger, 'info'>;
  prefetchAudioStart: (url: string, opts: { priority?: AudioPrefetchPriority }) => Promise<boolean>;
}): Promise<AudioPrefetchResult[]> {
  const normalizedOptions = normalizeRunAudioBatchPrefetchOptions(options);
  logAudioBatchPrefetchStart(logger, items, normalizedOptions);

  return runAudioBatchPrefetch(items, prefetchAudioStart, normalizedOptions);
}
