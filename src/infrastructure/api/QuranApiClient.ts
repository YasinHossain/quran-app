/**
 * HTTP client interface for API communication
 */
export interface IHttpClient {
  get<T>(url: string, options?: RequestInit): Promise<T>;
  post<T>(url: string, data?: any, options?: RequestInit): Promise<T>;
  put<T>(url: string, data?: any, options?: RequestInit): Promise<T>;
  delete<T>(url: string, options?: RequestInit): Promise<T>;
}

/**
 * API response types
 */
export interface ApiVerse {
  id: string;
  verse_number: number;
  chapter_id: number;
  verse_key: string;
  text_uthmani: string;
  text_simple: string;
  translation?: {
    id: number;
    resource_id: number;
    text: string;
    language_name: string;
  };
  audio?: {
    url: string;
    duration: number;
  };
}

export interface ApiSurah {
  id: number;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  revelation_place: 'makkah' | 'madinah';
  revelation_order?: number;
}

export interface ApiTranslation {
  id: number;
  resource_id: number;
  text: string;
  language_name: string;
  language_code?: string;
}

/**
 * Quran API client for external data sources
 */
export class QuranApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly httpClient: IHttpClient
  ) {}

  /**
   * Gets a single verse by surah ID and ayah number
   */
  async getVerse(surahId: number, ayahNumber: number): Promise<ApiVerse> {
    const url = `${this.baseUrl}/verses/by_chapter/${surahId}?verse_number=${ayahNumber}`;
    const response = await this.httpClient.get<{ verses: ApiVerse[] }>(url);

    if (!response.verses || response.verses.length === 0) {
      throw new Error(`Verse not found: ${surahId}:${ayahNumber}`);
    }

    return response.verses[0];
  }

  /**
   * Gets all verses in a surah
   */
  async getVersesBySurah(surahId: number, includeTranslation?: boolean): Promise<ApiVerse[]> {
    let url = `${this.baseUrl}/verses/by_chapter/${surahId}`;

    if (includeTranslation) {
      url += '?translations=131'; // Default English translation
    }

    const response = await this.httpClient.get<{ verses: ApiVerse[] }>(url);
    return response.verses || [];
  }

  /**
   * Gets verses by page number
   */
  async getVersesByPage(pageNumber: number): Promise<ApiVerse[]> {
    const url = `${this.baseUrl}/verses/by_page/${pageNumber}`;
    const response = await this.httpClient.get<{ verses: ApiVerse[] }>(url);
    return response.verses || [];
  }

  /**
   * Gets verses by Juz number
   */
  async getVersesByJuz(juzNumber: number): Promise<ApiVerse[]> {
    const url = `${this.baseUrl}/verses/by_juz/${juzNumber}`;
    const response = await this.httpClient.get<{ verses: ApiVerse[] }>(url);
    return response.verses || [];
  }

  /**
   * Searches verses by text
   */
  async searchVerses(query: string, limit: number = 20, offset: number = 0): Promise<ApiVerse[]> {
    const url = `${this.baseUrl}/search?q=${encodeURIComponent(query)}&size=${limit}&from=${offset}`;
    const response = await this.httpClient.get<{ search: { results: ApiVerse[] } }>(url);
    return response.search?.results || [];
  }

  /**
   * Gets a surah by ID
   */
  async getSurah(surahId: number): Promise<ApiSurah> {
    const url = `${this.baseUrl}/chapters/${surahId}`;
    const response = await this.httpClient.get<{ chapter: ApiSurah }>(url);

    if (!response.chapter) {
      throw new Error(`Surah not found: ${surahId}`);
    }

    return response.chapter;
  }

  /**
   * Gets all surahs
   */
  async getAllSurahs(): Promise<ApiSurah[]> {
    const url = `${this.baseUrl}/chapters`;
    const response = await this.httpClient.get<{ chapters: ApiSurah[] }>(url);
    return response.chapters || [];
  }

  /**
   * Gets translation for a verse
   */
  async getTranslation(verseId: string, translationId: number): Promise<ApiTranslation> {
    const url = `${this.baseUrl}/translations/${translationId}?verse_id=${verseId}`;
    const response = await this.httpClient.get<{ translations: ApiTranslation[] }>(url);

    if (!response.translations || response.translations.length === 0) {
      throw new Error(`Translation not found: ${verseId} with translation ${translationId}`);
    }

    return response.translations[0];
  }

  /**
   * Gets random verses
   * Since /verses/random endpoint returns 503, we generate random verse keys
   * and fetch them individually using working endpoints
   */
  async getRandomVerses(count: number): Promise<ApiVerse[]> {
    const randomVerses: ApiVerse[] = [];
    const usedKeys = new Set<string>();

    // Get all surahs to know verse counts
    const surahs = await this.getAllSurahs();

    for (let i = 0; i < count; i++) {
      let verseKey: string;
      let attempts = 0;
      const maxAttempts = 50; // Prevent infinite loop

      // Generate unique random verse key
      do {
        const randomSurah = surahs[Math.floor(Math.random() * surahs.length)];
        const randomAyah = Math.floor(Math.random() * randomSurah.verses_count) + 1;
        verseKey = `${randomSurah.id}:${randomAyah}`;
        attempts++;
      } while (usedKeys.has(verseKey) && attempts < maxAttempts);

      if (attempts >= maxAttempts) {
        console.warn('Max attempts reached for generating unique verse key');
        continue;
      }

      usedKeys.add(verseKey);

      try {
        const url = `${this.baseUrl}/verses/by_key/${verseKey}?translations=131&fields=text_uthmani`;
        const response = await this.httpClient.get<{ verse: ApiVerse }>(url);
        if (response.verse) {
          randomVerses.push(response.verse);
        }
      } catch (error) {
        // Skip this verse if it fails to fetch, but don't break the whole operation
        console.warn(`Failed to fetch verse ${verseKey}:`, error);
      }
    }

    return randomVerses;
  }
}
