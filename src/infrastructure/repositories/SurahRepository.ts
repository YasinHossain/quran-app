import { injectable, inject } from 'inversify';
import { ISurahRepository } from '../../domain/repositories/ISurahRepository';
import { Surah } from '../../domain/entities/Surah';
import { QuranApiClient } from '../api/QuranApiClient';
import { ICache } from '../../domain/repositories/ICache';

// // @injectable()
export class SurahRepository implements ISurahRepository {
  constructor(
    private apiClient: QuranApiClient,
    private cache: ICache
  ) {}

  async findById(id: number): Promise<Surah | null> {
    const cacheKey = `surah:${id}`;

    // Check cache first
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) {
      return this.mapToEntity(cached);
    }

    try {
      const data = await this.apiClient.get(`/chapters/${id}`);
      await this.cache.set(cacheKey, data, 3600);
      return this.mapToEntity(data);
    } catch (error) {
      return null;
    }
  }

  async findAll(): Promise<Surah[]> {
    const cacheKey = 'surahs:all';

    // Check cache first
    const cached = await this.cache.get<any[]>(cacheKey);
    if (cached) {
      return cached.map((data) => this.mapToEntity(data));
    }

    try {
      const data = await this.apiClient.get('/chapters');
      await this.cache.set(cacheKey, data, 3600);
      return data.map((item: any) => this.mapToEntity(item));
    } catch (error) {
      return [];
    }
  }

  async save(entity: Surah): Promise<void> {
    // For now, this is read-only - surahs don't change
    throw new Error('Surah entities are read-only');
  }

  async remove(id: number): Promise<void> {
    throw new Error('Surah entities cannot be removed');
  }

  async exists(id: number): Promise<boolean> {
    return (await this.findById(id)) !== null;
  }

  private mapToEntity(data: any): Surah {
    // This is a simplified mapping - adjust based on your actual API response
    return new Surah(
      data.id || data.number,
      data.name_simple || data.name,
      data.name_complex || data.arabicName || data.name_simple,
      data.translated_name?.name || data.englishName || data.name_simple,
      data.translated_name?.text || data.englishTranslation || '',
      data.verses_count || data.numberOfAyahs || 0,
      data.revelation_place === 'makkah' ? 'makki' : 'madani',
      data.revelation_order || 0
    );
  }
}
