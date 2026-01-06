import { Verse, Word } from '@/types';

export interface ApiWord {
  id: number;
  text: string;
  text_uthmani?: string;
  translation?: { text?: string };
  code_v2?: string;
  page_number?: number;
  position?: number;
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
            ...(w.code_v2 ? { codeV2: w.code_v2 } : {}),
            ...(w.page_number ? { pageNumber: w.page_number } : {}),
            ...(typeof w.position === 'number' ? { position: w.position } : {}),
          })
        ),
      }
      : {}),
  } as unknown as Verse;
}
