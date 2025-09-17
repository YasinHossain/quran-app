import { ILogger } from '@/src/domain/interfaces/ILogger';

export class AudioSegmentCache {
  private readonly cache = new Map<string, ArrayBuffer>();
  constructor(
    private readonly logger: ILogger,
    private readonly maxCacheSize: number
  ) {}

  async ensureSpace(newItemSize: number): Promise<void> {
    const currentSize = this.getSize();
    if (currentSize + newItemSize <= this.maxCacheSize) return;
    const entries = Array.from(this.cache.entries());
    let removedSize = 0;
    while (removedSize < newItemSize && entries.length > 0) {
      const [url, data] = entries.shift()!;
      this.cache.delete(url);
      removedSize += data.byteLength;
    }
    this.logger.debug('Cache cleanup completed', {
      removedSize,
      remainingSize: this.getSize(),
      spaceNeeded: newItemSize,
    });
  }

  set(url: string, data: ArrayBuffer): void {
    this.cache.set(url, data);
  }
  get(url: string): ArrayBuffer | null {
    return this.cache.get(url) || null;
  }
  has(url: string): boolean {
    return this.cache.has(url);
  }
  clearAudio(url: string): boolean {
    const deleted = this.cache.delete(url);
    if (deleted) this.logger.debug('Audio removed from prefetch cache', { url });
    return deleted;
  }
  clearAll(): void {
    const size = this.getSize();
    this.cache.clear();
    this.logger.info('Prefetch cache cleared', { clearedSize: size });
  }
  getStats(): { entries: number; totalSize: number; averageSize: number; urls: string[] } {
    const entries = this.cache.size;
    const totalSize = this.getSize();
    const averageSize = entries > 0 ? totalSize / entries : 0;
    const urls = Array.from(this.cache.keys());
    return { entries, totalSize, averageSize, urls };
  }
  createBlobUrl(url: string): string | null {
    const data = this.cache.get(url);
    if (!data) return null;
    try {
      const blob = new Blob([data], { type: 'audio/mpeg' });
      const blobUrl = URL.createObjectURL(blob);
      this.logger.debug('Created blob URL for prefetched audio', {
        originalUrl: url,
        blobUrl,
        size: data.byteLength,
      });
      return blobUrl;
    } catch (error) {
      this.logger.error('Failed to create blob URL', {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }
  getSize(): number {
    let totalSize = 0;
    for (const data of this.cache.values()) totalSize += data.byteLength;
    return totalSize;
  }
}
