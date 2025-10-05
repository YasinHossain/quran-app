import { Tafsir } from '@/src/domain/entities/Tafsir';
import { ITafsirRepository } from '@/src/domain/repositories/ITafsirRepository';

import { fetchAllResources, fetchTafsirByVerse } from './tafsir.utils';
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
    return fetchAllResources();
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
    return fetchTafsirByVerse(verseKey, tafsirId);
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
