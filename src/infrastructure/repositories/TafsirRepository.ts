import { fetchResourcesForLanguage } from './tafsirApi';
import {
  cacheResources as cacheTafsirResources,
  getCachedResources as getTafsirCachedResources,
} from './tafsirCache';
import { apiFetch } from '../../../lib/api/client';
import { Tafsir } from '../../domain/entities/Tafsir';
import { ITafsirRepository } from '../../domain/repositories/ITafsirRepository';
import { logger } from '../monitoring/Logger';

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
    try {
      // Try getting comprehensive list first
      const allResources = await fetchResourcesForLanguage('all');
      if (allResources.length > 1) {
        await cacheTafsirResources(allResources);
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
      languages.map((lang) => fetchResourcesForLanguage(lang))
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
      await cacheTafsirResources(tafsirs);
    }

    return tafsirs;
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
