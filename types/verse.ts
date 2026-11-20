/**
 * Text of a verse translated by a specific resource.
 */
export interface Translation {
  id?: number;
  resource_id: number;
  text: string;
  resource_name?: string;
}

/**
 * Audio recitation for a verse.
 */
export interface Audio {
  url: string;
}

import type { Word } from './word';

/**
 * A Quranic verse with optional translations, audio, and word data.
 */
export interface Verse {
  id: number;
  verse_key: string;

  /** IndoPak script verse text (if provided by the API). */
  text_indopak?: string;
  text_uthmani: string;
  verse_number?: number;
  chapter_id?: number;
  page_number?: number;
  audio?: Audio;
  translations?: Translation[];
  words?: Word[];
}

/**
 * Text-only verse used for server-rendered reader HTML (crawlers and pre-hydration readers).
 * Translation HTML is already sanitized and stripped of footnote markers.
 */
export interface PrerenderedVerse {
  verseKey: string;
  arabic: string;
  translations: Array<{ resourceId: number; html: string }>;
}
