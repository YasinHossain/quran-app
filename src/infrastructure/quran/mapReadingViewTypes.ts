import type { MushafCharType, MushafVerse, MushafWord } from '@/types';

/**
 * Raw word payload shape from the Quran.com QDC API for reading view endpoints.
 */
export interface ReadingViewApiWord {
  id?: number;
  verse_key?: string;
  page_number?: number;
  line_number?: number;
  position: number;
  char_type_name: string;
  location?: string;
  text_uthmani?: string;
  text_indopak?: string;
  code_v1?: string;
  code_v2?: string;
}

/**
 * Raw verse payload shape from the Quran.com reading view endpoint.
 */
export interface ReadingViewApiVerse {
  id: number;
  verse_key: string;
  chapter_id?: number | string;
  page_number: number;
  juz_number?: number;
  hizb_number?: number;
  rub_el_hizb_number?: number;
  text_uthmani?: string;
  text_indopak?: string;
  text_uthmani_tajweed?: string;
  words?: ReadingViewApiWord[];
}

/**
 * Map a raw reading view word payload into a {@link MushafWord}.
 */
export const mapReadingViewWordToMushafWord = (word: ReadingViewApiWord): MushafWord => ({
  id: word.id,
  verseKey: word.verse_key,
  pageNumber: word.page_number,
  lineNumber: word.line_number,
  position: word.position,
  charType: word.char_type_name as MushafCharType,
  location: word.location,
  textUthmani: word.text_uthmani,
  textIndopak: word.text_indopak,
  codeV1: word.code_v1,
  codeV2: word.code_v2,
});

/**
 * Map a raw reading view verse payload into a {@link MushafVerse}.
 */
export const mapReadingViewVerseToMushafVerse = (verse: ReadingViewApiVerse): MushafVerse => ({
  id: verse.id,
  verseKey: verse.verse_key,
  chapterId: verse.chapter_id,
  pageNumber: verse.page_number,
  juzNumber: verse.juz_number,
  hizbNumber: verse.hizb_number,
  rubElHizbNumber: verse.rub_el_hizb_number,
  textUthmani: verse.text_uthmani,
  textIndopak: verse.text_indopak,
  textUthmaniTajweed: verse.text_uthmani_tajweed,
  words: Array.isArray(verse.words) ? verse.words.map(mapReadingViewWordToMushafWord) : [],
});
