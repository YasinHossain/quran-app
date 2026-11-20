import { SITE_NAME } from '@/lib/seo/site';

const MAX_DESCRIPTION_LENGTH = 155;
const TITLE_SNIPPET_LENGTH = 40;
const ELLIPSIS = '…';

/** Strip HTML tags (including `<sup>` footnote markers) and collapse whitespace. */
export function cleanTranslationText(raw: string | undefined): string {
  if (!raw) return '';
  return raw
    .replace(/<sup\b[^>]*>[\s\S]*?<\/sup>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}

/** Trim to at most `max` characters on a word boundary, appending an ellipsis if cut. */
export function trimOnWordBoundary(text: string, max: number): string {
  if (text.length <= max) return text;
  const room = max - ELLIPSIS.length;
  const slice = text.slice(0, room + 1);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > room * 0.5 ? slice.slice(0, lastSpace) : text.slice(0, room);
  return `${cut.replace(/[\s,;:.\-–—]+$/, '')}${ELLIPSIS}`;
}

export interface TafsirMetadataText {
  title: string;
  description: string;
}

export function buildTafsirMetadataText(input: {
  chapterName: string;
  verseKey: string;
  translationText?: string | undefined;
}): TafsirMetadataText {
  const { chapterName, verseKey } = input;
  const translation = cleanTranslationText(input.translationText);

  if (!translation) {
    return {
      title: `Tafsir of ${chapterName} ${verseKey}`,
      description: `Read tafsir for ${chapterName} ${verseKey} on ${SITE_NAME}.`,
    };
  }

  const title = `${chapterName} ${verseKey} Tafsir – ${trimOnWordBoundary(translation, TITLE_SNIPPET_LENGTH)}`;
  const tail = ` Ibn Kathir tafsir of ${chapterName} ${verseKey}.`;
  const lead = trimOnWordBoundary(translation, MAX_DESCRIPTION_LENGTH);
  const withTail = `${lead}${tail}`;
  // Only append the tafsir mention when the translation leaves room for it.
  const description =
    translation.length + tail.length <= MAX_DESCRIPTION_LENGTH + 5
      ? withTail
      : `${trimOnWordBoundary(translation, MAX_DESCRIPTION_LENGTH - ' Ibn Kathir tafsir.'.length)} Ibn Kathir tafsir.`;

  return { title, description };
}
