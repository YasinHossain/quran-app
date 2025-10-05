import { Verse } from '@/src/domain/entities';

export interface IVerseRepository {
  // Basic CRUD operations
  findById(id: string): Promise<Verse | null>;
  save(verse: Verse): Promise<void>;
  remove(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;

  // Position-based queries
  findBySurahAndAyah(surahId: number, ayahNumber: number): Promise<Verse | null>;
  findBySurah(surahId: number): Promise<Verse[]>;
  findBySurahRange(surahId: number, fromAyah: number, toAyah: number): Promise<Verse[]>;

  // Juz/Para based queries
  findByJuz(juzNumber: number): Promise<Verse[]>;
  findByPage(pageNumber: number): Promise<Verse[]>;
  findByHizb(hizbNumber: number): Promise<Verse[]>;
  findByRubAlHizb(rubNumber: number): Promise<Verse[]>;

  // Search operations
  search(
    query: string,
    options?: {
      searchIn?: 'arabic' | 'translation' | 'both';
      translationId?: number;
      surahId?: number;
      limit?: number;
    }
  ): Promise<Verse[]>;

  // Special verse queries
  findSajdahVerses(): Promise<Verse[]>;
  findFirstVerses(): Promise<Verse[]>; // First verse of each Surah

  // Bulk operations
  findByVerseKeys(verseKeys: string[]): Promise<Verse[]>;
  findRandom(count?: number, surahId?: number): Promise<Verse[]>;

  // Statistics
  getTotalCount(): Promise<number>;
  getCountBySurah(surahId: number): Promise<number>;

  // Navigation helpers
  findNext(currentVerseId: string): Promise<Verse | null>;
  findPrevious(currentVerseId: string): Promise<Verse | null>;

  // Translation support
  findWithTranslation(verseId: string, translationId: number): Promise<Verse | null>;

  // Revelation type queries
  findByRevelationType(type: 'makki' | 'madani'): Promise<Verse[]>;

  // Offline support
  cacheForOffline(surahIds?: number[]): Promise<void>;
  clearCache(): Promise<void>;
}
