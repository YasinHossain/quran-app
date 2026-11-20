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

/**
 * Localisable wording. Placeholders: `{{chapter}}`, `{{verseKey}}`, `{{snippet}}`,
 * `{{siteName}}`, `{{tafsirName}}`. The English defaults match the `seo_tafsir_*` locale keys.
 */
export interface TafsirMetadataTemplates {
  title: string;
  titleFallback: string;
  descriptionFallback: string;
  tail: string;
  tailShort: string;
  tafsirName: string;
}

export const DEFAULT_TAFSIR_METADATA_TEMPLATES: TafsirMetadataTemplates = {
  title: '{{chapter}} {{verseKey}} Tafsir – {{snippet}}',
  titleFallback: 'Tafsir of {{chapter}} {{verseKey}}',
  descriptionFallback: 'Read tafsir for {{chapter}} {{verseKey}} on {{siteName}}.',
  tail: '{{tafsirName}} tafsir of {{chapter}} {{verseKey}}.',
  tailShort: '{{tafsirName}} tafsir.',
  tafsirName: 'Ibn Kathir',
};

const fill = (template: string, vars: Record<string, string>): string =>
  template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) => vars[name] ?? match);

export function buildTafsirMetadataText(input: {
  chapterName: string;
  verseKey: string;
  translationText?: string | undefined;
  templates?: TafsirMetadataTemplates | undefined;
}): TafsirMetadataText {
  const { chapterName, verseKey } = input;
  const templates = input.templates ?? DEFAULT_TAFSIR_METADATA_TEMPLATES;
  const translation = cleanTranslationText(input.translationText);
  const vars = {
    chapter: chapterName,
    verseKey,
    siteName: SITE_NAME,
    tafsirName: templates.tafsirName,
  };

  if (!translation) {
    return {
      title: fill(templates.titleFallback, vars),
      description: fill(templates.descriptionFallback, vars),
    };
  }

  const title = fill(templates.title, {
    ...vars,
    snippet: trimOnWordBoundary(translation, TITLE_SNIPPET_LENGTH),
  });
  const tail = ` ${fill(templates.tail, vars)}`;
  const shortTail = ` ${fill(templates.tailShort, vars)}`;
  const lead = trimOnWordBoundary(translation, MAX_DESCRIPTION_LENGTH);
  // Only append the full tafsir mention when the translation leaves room for it.
  const description =
    translation.length + tail.length <= MAX_DESCRIPTION_LENGTH + 5
      ? `${lead}${tail}`
      : `${trimOnWordBoundary(translation, MAX_DESCRIPTION_LENGTH - shortTail.length)}${shortTail}`;

  return { title, description };
}
