import { apiFetch } from '@/lib/api/client';
import { Tafsir } from '@/src/domain/entities/Tafsir';
import { ITafsirRepository } from '@/src/domain/repositories/ITafsirRepository';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { fetchResourcesForLanguage } from './tafsirApi';
import {
  cacheResources as cacheTafsirResources,
  getCachedResources as getTafsirCachedResources,
} from './tafsirCache';

/**
 * Infrastructure implementation of ITafsirRepository
 *
 * Handles external API communication and caching for Tafsir resources.
 * Uses the existing lib/api infrastructure but follows clean architecture patterns.
 */
export class TafsirRepository implements ITafsirRepository {
  /**
   * Get all available tafsir resources across languages
   */
  async getAllResources(): Promise<Tafsir[]> {
    const allResources = await this.tryFetchAll();
    if (allResources) {
      return allResources;
    }

    return this.fetchLanguageSpecificResources();
  }

  private async tryFetchAll(): Promise<Tafsir[] | null> {
    try {
      const allResources = await fetchResourcesForLanguage('all');
      if (allResources.length <= 1) {
        return null;
      }

      await cacheTafsirResources(allResources);
      return allResources;
    } catch (error) {
      logger.warn(
        'Failed to fetch all tafsir resources, trying language-specific approach',
        undefined,
        error as Error
      );
      return null;
    }
  }

  private async fetchLanguageSpecificResources(): Promise<Tafsir[]> {
    const languages = ['en', 'ar', 'bn', 'ur', 'id', 'tr', 'fa'];
    const results = await Promise.allSettled(
      languages.map((lang) => fetchResourcesForLanguage(lang))
    );

    const tafsirs = this.mergeResults(results);
    if (tafsirs.length === 0) {
      return [];
    }

    await cacheTafsirResources(tafsirs);
    return tafsirs;
  }

  private mergeResults(results: PromiseSettledResult<Tafsir[]>[]): Tafsir[] {
    const mergedMap = new Map<number, Tafsir>();

    const addToMap = (tafsir: Tafsir): void => {
      if (!mergedMap.has(tafsir.id)) {
        mergedMap.set(tafsir.id, tafsir);
      }
    };

    results
      .filter((r): r is PromiseFulfilledResult<Tafsir[]> => r.status === 'fulfilled')
      .flatMap((r) => r.value)
      .forEach(addToMap);

    return Array.from(mergedMap.values());
  }

  /**
   * Get tafsir resources for a specific language
   */
  async getResourcesByLanguage(language: string): Promise<Tafsir[]> {
    return fetchResourcesForLanguage(language);
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
    await cacheTafsirResources(tafsirs);
  }

  /**
   * Get cached tafsir resources
   */
  async getCachedResources(): Promise<Tafsir[]> {
    return getTafsirCachedResources();
  }
}
