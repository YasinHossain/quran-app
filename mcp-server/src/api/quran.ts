import { apiFetch } from './client.js';
import type {
  Verse,
  Chapter,
  Surah,
  Juz,
  JuzMetadata,
  TafsirResource,
  TafsirText,
  Translation,
  PaginatedResponse,
} from '../types.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load local Juz metadata
let juzMetadata: JuzMetadata[] = [];
try {
  const juzDataPath = join(__dirname, '../../../data/juz.json');
  juzMetadata = JSON.parse(readFileSync(juzDataPath, 'utf-8'));
} catch (error) {
  console.warn('Could not load juz metadata:', error);
}

interface ApiWord {
  id: number;
  text: string;
  text_uthmani?: string;
  translation?: { text?: string };
  [key: string]: unknown;
}

interface ApiVerse extends Omit<Verse, 'words'> {
  words?: ApiWord[];
}

function normalizeVerse(raw: ApiVerse, wordLang: string = 'en'): Verse {
  return {
    ...raw,
    words: raw.words?.map((w) => ({
      id: w.id,
      uthmani: w.text_uthmani ?? w.text,
      [wordLang]: w.translation?.text,
    })),
  };
}

export class QuranAPI {
  async getChapters(): Promise<Chapter[]> {
    const data = await apiFetch<{ chapters: Chapter[] }>(
      'chapters',
      { language: 'en' },
      'Failed to fetch chapters'
    );
    return data.chapters;
  }

  async getSurahList(): Promise<Surah[]> {
    const chapters = await this.getChapters();
    return chapters.map((c) => ({
      number: c.id,
      name: c.name_simple,
      arabicName: c.name_arabic,
      verses: c.verses_count,
      meaning: c.translated_name?.name ?? '',
    }));
  }

  async getChapter(id: number): Promise<Chapter | null> {
    try {
      const data = await apiFetch<{ chapter: Chapter }>(
        `chapters/${id}`,
        { language: 'en' },
        'Failed to fetch chapter'
      );
      return data.chapter;
    } catch {
      return null;
    }
  }

  async getVersesByChapter(
    chapterId: number,
    translationIds: number[] = [20],
    page: number = 1,
    perPage: number = 50,
    wordLang: string = 'en'
  ): Promise<PaginatedResponse<Verse>> {
    const translationParam = translationIds.join(',');

    const data = await apiFetch<{
      verses: ApiVerse[];
      meta?: { total_pages: number };
      pagination?: { total_pages: number };
    }>(
      `verses/by_chapter/${chapterId}`,
      {
        language: wordLang,
        words: 'true',
        word_translation_language: wordLang,
        word_fields: 'text_uthmani',
        translations: translationParam,
        fields: 'text_uthmani,audio',
        per_page: perPage.toString(),
        page: page.toString(),
      },
      'Failed to fetch verses'
    );

    const totalPages = data.meta?.total_pages ?? data.pagination?.total_pages ?? 1;
    const verses = data.verses.map((v) => normalizeVerse(v, wordLang));

    return {
      data: verses,
      totalPages,
      currentPage: page,
      perPage,
      total: verses.length * totalPages,
    };
  }

  async getVersesByJuz(
    juzId: number,
    translationIds: number[] = [20],
    page: number = 1,
    perPage: number = 50,
    wordLang: string = 'en'
  ): Promise<PaginatedResponse<Verse>> {
    const translationParam = translationIds.join(',');

    const data = await apiFetch<{
      verses: ApiVerse[];
      meta?: { total_pages: number };
      pagination?: { total_pages: number };
    }>(
      `verses/by_juz/${juzId}`,
      {
        language: wordLang,
        words: 'true',
        word_translation_language: wordLang,
        word_fields: 'text_uthmani',
        translations: translationParam,
        fields: 'text_uthmani,audio',
        per_page: perPage.toString(),
        page: page.toString(),
      },
      'Failed to fetch verses by juz'
    );

    const totalPages = data.meta?.total_pages ?? data.pagination?.total_pages ?? 1;
    const verses = data.verses.map((v) => normalizeVerse(v, wordLang));

    return {
      data: verses,
      totalPages,
      currentPage: page,
      perPage,
      total: verses.length * totalPages,
    };
  }

  async getVersesByPage(
    pageId: number,
    translationIds: number[] = [20],
    page: number = 1,
    perPage: number = 50,
    wordLang: string = 'en'
  ): Promise<PaginatedResponse<Verse>> {
    const translationParam = translationIds.join(',');

    const data = await apiFetch<{
      verses: ApiVerse[];
      meta?: { total_pages: number };
      pagination?: { total_pages: number };
    }>(
      `verses/by_page/${pageId}`,
      {
        language: wordLang,
        words: 'true',
        word_translation_language: wordLang,
        word_fields: 'text_uthmani',
        translations: translationParam,
        fields: 'text_uthmani,audio',
        per_page: perPage.toString(),
        page: page.toString(),
      },
      'Failed to fetch verses by page'
    );

    const totalPages = data.meta?.total_pages ?? data.pagination?.total_pages ?? 1;
    const verses = data.verses.map((v) => normalizeVerse(v, wordLang));

    return {
      data: verses,
      totalPages,
      currentPage: page,
      perPage,
      total: verses.length * totalPages,
    };
  }

  async getVerse(verseId: number, translationIds: number[] = [20]): Promise<Verse | null> {
    try {
      const translationParam = translationIds.join(',');
      const data = await apiFetch<{ verse: ApiVerse }>(
        `verses/${verseId}`,
        {
          translations: translationParam,
          fields: 'text_uthmani,audio',
          words: 'true',
          word_fields: 'text_uthmani',
        },
        'Failed to fetch verse'
      );
      return normalizeVerse(data.verse);
    } catch {
      return null;
    }
  }

  async searchVerses(query: string, size: number = 20): Promise<Verse[]> {
    const data = await apiFetch<{ search?: { results: any[] } }>(
      'search',
      { q: query, size: size.toString(), translations: '20' },
      'Failed to search verses'
    );

    const results = data.search?.results || [];
    return results.map((r) => ({
      id: r.verse_id,
      verse_key: r.verse_key,
      text_uthmani: r.text,
      translations: r.translations,
    })) as Verse[];
  }

  async getRandomVerse(translationId: number = 20): Promise<Verse | null> {
    try {
      const data = await apiFetch<{ verse: ApiVerse }>(
        'verses/random',
        {
          translations: translationId.toString(),
          fields: 'text_uthmani,audio',
          words: 'true',
        },
        'Failed to fetch random verse'
      );
      return normalizeVerse(data.verse);
    } catch {
      return null;
    }
  }

  async getJuz(juzId: number): Promise<Juz | null> {
    try {
      const data = await apiFetch<{ juz: Juz }>(`juzs/${juzId}`, {}, 'Failed to fetch juz');
      return data.juz;
    } catch {
      return null;
    }
  }

  getJuzMetadata(): JuzMetadata[] {
    return juzMetadata;
  }

  async getTranslations(language?: string): Promise<Translation[]> {
    const params: Record<string, string> = {};
    if (language) {
      params.language = language;
    }
    const data = await apiFetch<{ translations: Translation[] }>(
      'resources/translations',
      params,
      'Failed to fetch translations'
    );
    return data.translations;
  }

  async getTafsirResources(language?: string): Promise<TafsirResource[]> {
    const params: Record<string, string> = {};
    if (language) {
      params.language = language;
    }
    const data = await apiFetch<{ tafsirs: TafsirResource[] }>(
      'resources/tafsirs',
      params,
      'Failed to fetch tafsir resources'
    );
    return data.tafsirs;
  }

  async getTafsir(verseKey: string, tafsirId: number): Promise<TafsirText | null> {
    try {
      const data = await apiFetch<{ tafsirs: TafsirText[] }>(
        `verses/${verseKey}/tafsirs/${tafsirId}`,
        {},
        'Failed to fetch tafsir'
      );
      return data.tafsirs[0] || null;
    } catch {
      return null;
    }
  }
}
