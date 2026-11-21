import { SITE_NAME } from '@/lib/seo/site';
import { cleanTranslationText, trimOnWordBoundary } from '@/lib/seo/tafsirMetadata';
import { localizeDigits } from '@/lib/text/localizeNumbers';

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
 * The verse key as it reads in the page language. Where the locale has its own digits the
 * Western key follows once (`২:২৫৫ (2:255)`), since people search with either form.
 */
export function buildSearchableVerseKey(verseKey: string, locale: string | undefined): string {
  const localized = locale ? localizeDigits(verseKey, locale) : verseKey;
  return localized === verseKey ? verseKey : `${localized} (${verseKey})`;
}

/**
 * Title `Surah Al-Baqarah 2:255 – Allāh - there is no deity except Him…` and a description led by
 * the verse's translation (or the Arabic text where the page has no translation). With a `locale`
 * that has its own digits, the key is localized and the Western key is added once
 * (`সূরা আল-বাকারা ২:২৫৫ (2:255) – …`).
 */
export function buildVerseMetadataText(input: {
  surahName: string;
  verseKey: string;
  /** Translation HTML/text that leads the snippet; the Arabic text for Arabic pages. */
  leadText?: string | undefined;
  templates?: VerseMetadataTemplates | undefined;
  /** UI language of the page; decides the digits of the verse key. */
  locale?: string | undefined;
}): { title: string; description: string } {
  const templates = input.templates ?? DEFAULT_VERSE_METADATA_TEMPLATES;
  const lead = cleanTranslationText(input.leadText);
  const verseKey = buildSearchableVerseKey(input.verseKey, input.locale);
  const vars = { surah: input.surahName, verseKey, siteName: SITE_NAME };
  // The added Western key comes out of the snippet so titles keep their length.
  const snippetLength = TITLE_SNIPPET_LENGTH - (verseKey.length - input.verseKey.length);

  if (!lead) {
    return {
      title: fill(templates.titleFallback, vars),
      description: fill(templates.descriptionFallback, vars),
    };
  }

  const title = fill(templates.title, {
    ...vars,
    snippet: trimOnWordBoundary(lead, snippetLength),
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
