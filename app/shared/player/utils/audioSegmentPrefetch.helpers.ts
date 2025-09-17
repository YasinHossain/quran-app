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

export function getPriorityDistribution(items: AudioPrefetchItem[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    const priority = item.priority || 'medium';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {});
}

export async function runAudioBatchPrefetch(
  items: AudioPrefetchItem[],
  prefetchAudioStart: (url: string, opts: { priority?: AudioPrefetchPriority }) => Promise<boolean>,
  options: RunAudioBatchPrefetchOptions = {}
): Promise<AudioPrefetchResult[]> {
  const { maxConcurrent = 3, delayBetween = 100 } = options;
  const safeMaxConcurrent = Math.max(1, Math.floor(maxConcurrent));
  const safeDelayBetween = Math.max(0, delayBetween);

  const priorityOrder: Record<AudioPrefetchPriority, number> = { high: 0, medium: 1, low: 2 };
  const sortedItems = [...items].sort(
    (a, b) => priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium']
  );

  const results: AudioPrefetchResult[] = [];

  for (let i = 0; i < sortedItems.length; i += safeMaxConcurrent) {
    const batch = sortedItems.slice(i, i + safeMaxConcurrent);
    const batchResults = await Promise.all(
      batch.map(async (item) => {
        const startTime = performance.now();
        const success = await prefetchAudioStart(item.url, { priority: item.priority });
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

    const hasMoreItems = i + safeMaxConcurrent < sortedItems.length;
    if (hasMoreItems && safeDelayBetween > 0) {
      await new Promise((resolve) => setTimeout(resolve, safeDelayBetween));
    }
  }

  return results;
}
