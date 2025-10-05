import { getItem, setItem, removeItem } from '@/lib/utils/safeLocalStorage';
import { Tafsir, TafsirData } from '@/src/domain/entities/Tafsir';
import { logger } from '@/src/infrastructure/monitoring/Logger';

const CACHE_KEY = 'tafsir-resources';
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function cacheResources(tafsirs: Tafsir[]): Promise<void> {
  try {
    const cacheData = {
      timestamp: Date.now(),
      data: tafsirs.map((t) => t.toJSON()),
    };
    setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    logger.warn('Failed to cache tafsir resources', undefined, error as Error);
  }
}

export async function getCachedResources(): Promise<Tafsir[]> {
  try {
    const cached = getItem(CACHE_KEY);
    if (!cached) return [];

    const cacheData = JSON.parse(cached);
    const now = Date.now();

    if (now - cacheData.timestamp > CACHE_TTL) {
      removeItem(CACHE_KEY);
      return [];
    }

    return cacheData.data.map((data: TafsirData) => Tafsir.fromJSON(data));
  } catch (error) {
    logger.warn('Failed to get cached tafsir resources', undefined, error as Error);
    removeItem(CACHE_KEY);
    return [];
  }
}
