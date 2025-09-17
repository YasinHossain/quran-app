import { ILogger } from '@/src/domain/interfaces/ILogger';

async function getResponseSize(response: Response): Promise<number> {
  try {
    const contentLength = response.headers.get('content-length');
    if (contentLength) return parseInt(contentLength, 10);
    const clone = response.clone();
    const blob = await clone.blob();
    return blob.size;
  } catch {
    return 0;
  }
}

function getResponseTimestamp(response: Response): number {
  const dateHeader = response.headers.get('date');
  if (dateHeader) {
    const date = new Date(dateHeader);
    if (!isNaN(date.getTime())) return date.getTime();
  }
  return Date.now();
}

export async function getCacheStatsFor(
  cacheName: string,
  logger: ILogger
): Promise<{
  count: number;
  totalSize: number;
  entries: Array<{ url: string; size: number; timestamp: number }>;
}> {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const entries: Array<{ url: string; size: number; timestamp: number }> = [];
  let totalSize = 0;

  for (const request of keys) {
    const response = await cache.match(request).catch(() => null as Response | null);
    if (!response) {
      logger.debug('Failed to read cache entry', { url: request.url });
      continue;
    }
    const size = await getResponseSize(response);
    const timestamp = getResponseTimestamp(response);
    entries.push({ url: request.url, size, timestamp });
    totalSize += size;
  }

  return { count: entries.length, totalSize, entries };
}

export async function cleanupCacheFor(
  cacheName: string,
  logger: ILogger,
  maxAge: number,
  maxEntries: number
): Promise<void> {
  const stats = await getCacheStatsFor(cacheName, logger);
  const now = Date.now();
  const cache = await caches.open(cacheName);

  const sortedEntries = stats.entries.sort((a, b) => a.timestamp - b.timestamp);
  const oldEntries = sortedEntries.filter((e) => now - e.timestamp > maxAge);
  const excessCount = Math.max(0, sortedEntries.length - maxEntries);
  const entriesToRemove = [...oldEntries, ...sortedEntries.slice(0, excessCount)];
  const urlsToRemove = [...new Set(entriesToRemove.map((e) => e.url))];

  for (const url of urlsToRemove) await cache.delete(url);

  if (urlsToRemove.length > 0) {
    logger.debug('Cache cleanup completed', {
      removedCount: urlsToRemove.length,
      reason: oldEntries.length > 0 ? 'age and count limits' : 'count limit',
    });
  }
}

export async function preloadAudioListHelper(
  urls: string[],
  preloadAudio: (url: string) => Promise<boolean>,
  logger: ILogger,
  options: { concurrency?: number; priority?: 'high' | 'low' } = {}
): Promise<{ successful: string[]; failed: string[] }> {
  const { concurrency = 3, priority = 'low' } = options;
  const successful: string[] = [];
  const failed: string[] = [];

  logger.info('Starting batch audio preload', { count: urls.length, concurrency });

  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchPromises = batch.map(async (url) => {
      if (priority === 'low') await new Promise((r) => setTimeout(r, 100));
      const success = await preloadAudio(url);
      if (success) successful.push(url);
      else failed.push(url);
    });
    await Promise.allSettled(batchPromises);
  }

  logger.info('Batch audio preload completed', {
    successful: successful.length,
    failed: failed.length,
    total: urls.length,
  });

  return { successful, failed };
}
