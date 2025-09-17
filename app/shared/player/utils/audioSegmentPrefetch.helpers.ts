import { ILogger } from '@/src/domain/interfaces/ILogger';

export function getPriorityDistribution(
  items: Array<{ priority?: 'high' | 'medium' | 'low' }>
): Record<string, number> {
  return items.reduce(
    (acc, item) => {
      const priority = item.priority || 'medium';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}

export async function prefetchAudioListHelper(
  items: Array<{ url: string; priority?: 'high' | 'medium' | 'low' }>,
  prefetchAudioStart: (
    url: string,
    opts: { priority?: 'high' | 'medium' | 'low' }
  ) => Promise<boolean>,
  logger: ILogger,
  options: { maxConcurrent?: number; delayBetween?: number } = {}
) {
  const { maxConcurrent = 3, delayBetween = 100 } = options;
  const priorityOrder = { high: 0, medium: 1, low: 2 } as const;
  const sortedItems = items.sort(
    (a, b) => priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium']
  );

  logger.info('Starting batch audio prefetch', {
    total: sortedItems.length,
    maxConcurrent,
  });

  const results: Array<{ url: string; success: boolean; size: number; duration: number }> = [];

  for (let i = 0; i < sortedItems.length; i += maxConcurrent) {
    const batch = sortedItems.slice(i, i + maxConcurrent);
    const batchPromises = batch.map(async (item) => {
      const startTime = performance.now();
      const success = await prefetchAudioStart(item.url, { priority: item.priority });
      const duration = performance.now() - startTime;
      return { url: item.url, success, size: 0, duration };
    });
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    if (delayBetween > 0 && i + maxConcurrent < sortedItems.length) {
      await new Promise((r) => setTimeout(r, delayBetween));
    }
  }

  return results;
}
