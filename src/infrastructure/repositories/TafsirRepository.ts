import { getItem, setItem, removeItem } from '@/lib/utils/safeLocalStorage';

import { apiFetch } from '../../../lib/api/client';
import { Tafsir, TafsirData } from '../../domain/entities/Tafsir';
import { ITafsirRepository } from '../../domain/repositories/ITafsirRepository';
import { logger } from '../monitoring/Logger';

interface ApiTafsirResource {
  id: number;
  slug: string;
  name: string;
  language_name: string;
  author_name?: string;
}

/**
 * Infrastructure implementation of ITafsirRepository
 *
 * Handles external API communication and caching for Tafsir resources.
 * Uses the existing lib/api infrastructure but follows clean architecture patterns.
 */
export class TafsirRepository implements ITafsirRepository {
  private readonly CACHE_KEY = 'tafsir-resources';
  private readonly CACHE_TTL = 1000 * 60 * 60; // 1 hour

  /**
   * Get all available tafsir resources across languages
   */
  async getAllResources(): Promise<Tafsir[]> {
    try {
      // Try getting comprehensive list first
      const allResources = await this.fetchResourcesForLanguage('all');
      if (allResources.length > 1) {
        await this.cacheResources(allResources);
        return allResources;
      }
    } catch (error) {
      logger.warn(
        'Failed to fetch all tafsir resources, trying language-specific approach',
        undefined,
        error as Error
      );
    }

    // Fallback to language-specific fetching
    const languages = ['en', 'ar', 'bn', 'ur', 'id', 'tr', 'fa'];
    const results = await Promise.allSettled(
      languages.map((lang) => this.fetchResourcesForLanguage(lang))
    );

    // Merge results and deduplicate by ID
    const mergedMap = new Map<number, Tafsir>();
    for (const result of results) {
      if (result.status === 'fulfilled') {
        for (const tafsir of result.value) {
          if (!mergedMap.has(tafsir.id)) {
            mergedMap.set(tafsir.id, tafsir);
          }
        }
      }
    }

    const tafsirs = Array.from(mergedMap.values());
    if (tafsirs.length > 0) {
      await this.cacheResources(tafsirs);
    }

    return tafsirs;
  }

  /**
   * Get tafsir resources for a specific language
   */
  async getResourcesByLanguage(language: string): Promise<Tafsir[]> {
    return this.fetchResourcesForLanguage(language);
  }

  /**
   * Get a specific tafsir by ID
   */
  async getById(id: number): Promise<Tafsir | null> {
    const allResources = await this.getAllResources();
    return allResources.find((t) => t.id === id) || null;
  }

  /**
   * Get tafsir content for a specific verse
   */
  async getTafsirByVerse(verseKey: string, tafsirId: number): Promise<string> {
    try {
      // Try primary API first
      const data = await apiFetch<{ tafsir?: { text: string } }>(
        `tafsirs/${tafsirId}/by_ayah/${encodeURIComponent(verseKey)}`,
        {},
        'Failed to fetch tafsir'
      );
      if (data?.tafsir?.text) {
        return data.tafsir.text;
      }
    } catch (error) {
      logger.warn('Primary tafsir API failed, trying fallback', undefined, error as Error);
    }

    // Fallback to CDN endpoint
    const cdnUrl = `https://api.qurancdn.com/api/qdc/tafsirs/${tafsirId}/by_ayah/${encodeURIComponent(verseKey)}`;
    const data = await apiFetch<{ tafsir?: { text: string } }>(
      cdnUrl,
      {},
      'Failed to fetch tafsir content'
    );
    return data.tafsir?.text || '';
  }

  /**
   * Search tafsir resources by name or language
   */
  async search(searchTerm: string): Promise<Tafsir[]> {
    const allResources = await this.getAllResources();
    return allResources.filter((tafsir) => tafsir.matchesSearch(searchTerm));
  }

  /**
   * Cache tafsir resources for offline access
   */
  async cacheResources(tafsirs: Tafsir[]): Promise<void> {
    try {
      const cacheData = {
        timestamp: Date.now(),
        data: tafsirs.map((t) => t.toJSON()),
      };
      setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      logger.warn('Failed to cache tafsir resources', undefined, error as Error);
    }
  }

  /**
   * Get cached tafsir resources
   */
  async getCachedResources(): Promise<Tafsir[]> {
    try {
      const cached = getItem(this.CACHE_KEY);
      if (!cached) return [];

      const cacheData = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (now - cacheData.timestamp > this.CACHE_TTL) {
        removeItem(this.CACHE_KEY);
        return [];
      }

      return cacheData.data.map((data: TafsirData) => Tafsir.fromJSON(data));
    } catch (error) {
      logger.warn('Failed to get cached tafsir resources', undefined, error as Error);
      removeItem(this.CACHE_KEY);
      return [];
    }
  }

  /**
   * Private helper to fetch resources for a specific language
   */
  private async fetchResourcesForLanguage(language?: string): Promise<Tafsir[]> {
    const params: Record<string, string> = language
      ? { language, per_page: '200', page: '1' }
      : { per_page: '200', page: '1' };

    try {
      // Try primary API
      const data = await apiFetch<{ tafsirs: ApiTafsirResource[] }>(
        'resources/tafsirs',
        params,
        'Failed to fetch tafsir resources'
      );

      if (data.tafsirs && data.tafsirs.length > 0) {
        return this.mapApiResponseToEntities(data.tafsirs);
      }
    } catch (error) {
      logger.warn('Primary API failed, trying CDN fallback', undefined, error as Error);
    }

    // Fallback to CDN API
    const url = 'https://api.qurancdn.com/api/qdc/resources/tafsirs';
    const cdnParams: Record<string, string> = { per_page: '200', page: '1' };
    if (language && language !== 'all') {
      cdnParams.language = language;
    }
    const fallbackData = await apiFetch<{ tafsirs: ApiTafsirResource[] }>(
      url,
      cdnParams,
      'Failed to fetch tafsir resources'
    );
    return this.mapApiResponseToEntities(fallbackData.tafsirs || []);
  }

  /**
   * Map API response to domain entities
   */
  private mapApiResponseToEntities(apiTafsirs: ApiTafsirResource[]): Tafsir[] {
    return apiTafsirs.map((apiTafsir) => {
      const tafsirData: TafsirData = {
        id: apiTafsir.id,
        name: apiTafsir.name,
        lang: apiTafsir.language_name,
        authorName: apiTafsir.author_name,
        slug: apiTafsir.slug,
      };
      return new Tafsir(tafsirData);
    });
  }
}
