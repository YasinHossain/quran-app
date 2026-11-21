import { ENABLED_LANGUAGES } from '@/app/shared/i18n/languageRegistry';
import { absoluteUrl, getSiteUrl, SITE_NAME } from '@/lib/seo/site';
import { SURAH_SLUGS } from '@/lib/seo/surahSlugs';

/** Body of `/llms.txt` (https://llmstxt.org), built from the surah slugs and language registry. */
const pattern = (path: string): string => `${getSiteUrl()}${path}`;

// Names of the default sources in `languageRegistry.ts` (which only stores resource ids).
const TRANSLATION_SOURCES: Readonly<Record<string, string>> = {
  en: 'Saheeh International',
  bn: 'Taisirul Quran',
  ur: 'Maulana Muhammad Junagarhi',
  hi: 'Maulana Azizul Haque al-Umari',
};

const TAFSIR_SOURCES: Readonly<Record<string, string>> = {
  en: 'Tafsir Ibn Kathir (abridged, English)',
  bn: 'Tafseer ibn Kathir (Bangla)',
  ar: 'Tafsir Ibn Kathir (Arabic)',
  ur: 'Tafsir Ibn Kathir (Urdu)',
};

const slugToLabel = (slug: string): string =>
  slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('-');

function languageLines(): string[] {
  return ENABLED_LANGUAGES.map((language) => {
    const prefix = language.code === 'en' ? 'no prefix' : `\`/${language.code}\``;
    const translation = TRANSLATION_SOURCES[language.code];
    const tafsir = language.content.hasOwnTafsir ? TAFSIR_SOURCES[language.code] : undefined;
    const parts = [
      translation ? `translation: ${translation}` : 'Arabic text only, no translation line',
      tafsir ? `tafsir: ${tafsir}` : 'tafsir: English Tafsir Ibn Kathir (no own-language tafsir)',
    ];
    return `- ${language.englishName} (${prefix}): ${parts.join('; ')}`;
  });
}

export function buildLlmsTxt(names: ReadonlyMap<number, string>): string {
  const surahLines = SURAH_SLUGS.map((slug, index) => {
    const id = index + 1;
    const name = names.get(id) ?? slugToLabel(slug);
    return `- [${id}. ${name}](${absoluteUrl(`/surah/${slug}`)})`;
  });
  const languageNames = ENABLED_LANGUAGES.map((l) => l.englishName).join(', ');

  return [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_NAME} (appquran.com) is a free Quran reader with the Arabic text (Uthmani script), translations, tafsir (commentary) and audio recitation, plus a mobile app. The website is available in ${languageNames}.`,
    '',
    'Translations and tafsir are published scholarly works served from the Quran.com content API, never machine translated. Verses are addressed by surah and verse number.',
    '',
    '## URL patterns',
    '',
    `- Surah: ${pattern('/surah/{slug}')} (e.g. ${absoluteUrl('/surah/al-baqarah')})`,
    `- Verse: ${pattern('/surah/{slug}/{verse}')} (e.g. ${absoluteUrl('/surah/al-baqarah/255')})`,
    `- Tafsir for a verse: ${pattern('/tafsir/{slug}/{verse}')} (e.g. ${absoluteUrl('/tafsir/al-baqarah/255')})`,
    `- Juz: ${pattern('/juz/{1-30}')} (e.g. ${absoluteUrl('/juz/1')})`,
    '- Locale prefixes: `/bn`, `/ur`, `/ar`, `/hi` before any path (e.g. `/bn/surah/al-baqarah/255`); English has no prefix.',
    '- Shortcuts such as `/2/255` (surah number and verse) redirect to the canonical URL `/surah/al-baqarah/255`.',
    '- Slugs are the same Latin string in every language; the Surahs list below gives the slug of all 114 surahs.',
    '',
    '## Default translations and tafsir by language',
    '',
    ...languageLines(),
    '',
    '## Main pages',
    '',
    `- [Home](${absoluteUrl('/')}): featured surahs and verse of the day`,
    `- [Surah index](${absoluteUrl('/surah')}): all 114 surahs`,
    `- [Juz index](${absoluteUrl('/juz')}): the 30 juz`,
    `- [Sitemap index](${absoluteUrl('/sitemap.xml')}): every surah, verse, juz and tafsir page, per language`,
    '',
    '## Surahs',
    '',
    ...surahLines,
    '',
  ].join('\n');
}
