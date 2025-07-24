export interface Translation {
  id?: number;
  resource_id: number;
  text: string;
}

export interface Audio {
  url: string;
}

import type { Word } from './word';

export interface Verse {
  id: number;
  verse_key: string;
  text_uthmani: string;
  audio?: Audio;
  translations?: Translation[];
  words?: Word[];
}
