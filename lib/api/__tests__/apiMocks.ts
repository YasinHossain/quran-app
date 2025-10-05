import { Verse } from '@/types';

export interface RawWord {
  id: number;
  text?: string;
  text_uthmani?: string;
  translation?: { text: string };
}

export type RawVerse = Omit<Verse, 'words'> & { words: RawWord[] };
