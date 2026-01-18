import { stripHtml } from '@/lib/text/stripHtml';

const LEADING_VERSE_REF = /^\s*\[\s*\d+\s*:\s*\d+\s*\]\s*/;
const SEE_REFERENCE_PARENS = /\s*\(\s*see\b[^)]*\)\s*/gi;

/**
 * Cleans Quran.com translation strings for UI display.
 *
 * - Strips HTML
 * - Removes leading verse references like "[9:63]"
 * - Removes "See ..." parenthetical references like "(See V. 21:98-101)"
 * - Normalizes whitespace
 */
export function cleanTranslationText(input: string): string {
  const plain = stripHtml(input).replace(/\u00a0/g, ' ');
  return plain
    .replace(LEADING_VERSE_REF, '')
    .replace(SEE_REFERENCE_PARENS, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

