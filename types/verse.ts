/**
 * Text of a verse translated by a specific resource.
 */
export interface Translation {
  id?: number;
  resource_id: number;
  text: string;
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

  text_uthmani: string;
  verse_number?: number;
  chapter_id?: number;
  page_number?: number;
  audio?: Audio;
  translations?: Translation[];
  words?: Word[];
}
