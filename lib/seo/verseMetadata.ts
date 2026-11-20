import { SITE_NAME } from '@/lib/seo/site';
import { cleanTranslationText, trimOnWordBoundary } from '@/lib/seo/tafsirMetadata';

const MAX_DESCRIPTION_LENGTH = 155;
const TITLE_SNIPPET_LENGTH = 40;
const TAFSIR_EXCERPT_LENGTH = 450;

/**
 * Localisable wording for verse page titles/descriptions. Placeholders: `{{surah}}` (e.g.
 * "Surah Al-Baqarah"), `{{verseKey}}`, `{{snippet}}`, `{{siteName}}`. The English defaults match
 * the `seo_verse_*` locale keys.
 */
export interface VerseMetadataTemplates {
  title: string;
  titleFallback: string;
  descriptionFallback: string;
  tail: string;
  tailShort: string;
}

export const DEFAULT_VERSE_METADATA_TEMPLATES: VerseMetadataTemplates = {
  title: '{{surah}} {{verseKey}} – {{snippet}}',
  titleFallback: '{{surah}} {{verseKey}}',
  descriptionFallback:
    'Read {{surah}} {{verseKey}} with Arabic text, translation and tafsir on {{siteName}}.',
  tail: '{{surah}} {{verseKey}} with Arabic text and tafsir.',
  tailShort: '{{surah}} {{verseKey}}.',
};

const fill = (template: string, vars: Record<string, string>): string =>
  template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) => vars[name] ?? match);

/**
 * Title `Surah Al-Baqarah 2:255 – Allāh - there is no deity except Him…` and a description led by
 * the verse's translation (or the Arabic text where the page has no translation).
 */
export function buildVerseMetadataText(input: {
  surahName: string;
  verseKey: string;
  /** Translation HTML/text that leads the snippet; the Arabic text for Arabic pages. */
  leadText?: string | undefined;
  templates?: VerseMetadataTemplates | undefined;
}): { title: string; description: string } {
  const templates = input.templates ?? DEFAULT_VERSE_METADATA_TEMPLATES;
  const lead = cleanTranslationText(input.leadText);
  const vars = { surah: input.surahName, verseKey: input.verseKey, siteName: SITE_NAME };

  if (!lead) {
    return {
      title: fill(templates.titleFallback, vars),
      description: fill(templates.descriptionFallback, vars),
    };
  }

  const title = fill(templates.title, {
    ...vars,
    snippet: trimOnWordBoundary(lead, TITLE_SNIPPET_LENGTH),
  });
  const tail = ` ${fill(templates.tail, vars)}`;
  const shortTail = ` ${fill(templates.tailShort, vars)}`;
  const description =
    lead.length + tail.length <= MAX_DESCRIPTION_LENGTH + 5
      ? `${lead}${tail}`
      : `${trimOnWordBoundary(lead, MAX_DESCRIPTION_LENGTH - shortTail.length)}${shortTail}`;

  return { title, description };
}

// Block-level tags become spaces so a heading does not run into the next paragraph.
const BLOCK_TAG = /<\/?(?:p|div|h[1-6]|li|ul|ol|br|blockquote|section)\b[^>]*>/gi;

/**
 * Plain-text excerpt of tafsir HTML for the verse page: tags and footnotes removed, entities
 * decoded, cut on a word boundary. Rendered as text (never as HTML), so it cannot inject markup.
 */
export function buildTafsirExcerpt(
  html: string | undefined,
  maxLength = TAFSIR_EXCERPT_LENGTH
): string {
  if (!html) return '';
  const text = cleanTranslationText(html.replace(BLOCK_TAG, ' '))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)));
  return trimOnWordBoundary(text, maxLength);
}
