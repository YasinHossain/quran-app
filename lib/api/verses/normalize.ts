import { Verse, Word } from '@/types';

export interface ApiWord {
  id: number;
  text: string;
  text_uthmani?: string;
  translation?: { text?: string };
  [key: string]: unknown;
}

export interface ApiVerse extends Omit<Verse, 'words'> {
  words?: ApiWord[];
}

/**
 * Normalize API verse data into the internal `Verse` shape.
 *
 * @param raw       Verse object as returned by the API.
 * @param wordLang  Key used for word-by-word translations.
 *
 * Safely maps optional `words` array, falling back to base text when the
 * Uthmani script or translations are missing.
 */
export function normalizeVerse(raw: ApiVerse, wordLang: string = 'en'): Verse {
  const { words: wordsRaw, ...rest } = raw;
  return {
    ...(rest as Omit<ApiVerse, 'words'>),
    ...(wordsRaw
      ? {
          words: wordsRaw.map(
            (w): Word => ({
              id: w.id,
              uthmani: w.text_uthmani ?? w.text,
              [wordLang]: w.translation?.text,
            })
          ),
        }
      : {}),
  } as unknown as Verse;
}
