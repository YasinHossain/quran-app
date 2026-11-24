/**
 * Static attribution for what the website ships or loads: content providers, Arabic fonts and
 * word-by-word / transliteration data. Translation, tafsir and reciter names are never listed
 * here; the page loads them from the API. Keep font entries aligned with `public/fonts/LICENSES.md`.
 */
export interface SourceCredit {
  id: string;
  /** Proper name of the source. Not translated. */
  title: string;
  /** Who made it. Proper names, not translated. */
  credit: string;
  /** `common.json` key describing what the site uses it for. */
  usageKey?: string;
  license?: string;
  url?: string;
}

export const CONTENT_PROVIDER_CREDITS: readonly SourceCredit[] = [
  {
    id: 'quran-foundation',
    title: 'Quran Foundation · Quran.com',
    credit: 'Quran.com Content APIs and CDN, operated by Quran Foundation.',
    usageKey: 'about_usage_quran_foundation',
    url: 'https://quran.foundation',
  },
  {
    id: 'quran-com-open-source',
    title: 'Quran.com open-source web app',
    credit: 'Quran.com frontend, developed in the open by Quran Foundation and its contributors.',
    usageKey: 'about_usage_quran_com_frontend',
    url: 'https://github.com/quran/quran.com-frontend-next',
  },
  {
    id: 'kfgqpc',
    title: 'King Fahd Glorious Quran Printing Complex',
    credit:
      'KFGQPC Uthmanic Hafs and Uthman Taha typefaces, and the per-page mushaf glyph fonts (QCF).',
    usageKey: 'about_usage_kfgqpc',
    license: 'KFGQPC Electronic End-User License Agreement',
    url: 'https://fonts.qurancomplex.gov.sa/',
  },
];

export const ARABIC_FONT_CREDITS: readonly SourceCredit[] = [
  {
    id: 'indopak-nastaleeq',
    title: 'IndoPak Nastaleeq Waqf Lazim',
    credit: 'Authored by QuranWBW; distributed through Quran.com.',
    url: 'https://github.com/quran/quran.com-frontend-next',
  },
  {
    id: 'noorehidayat',
    title: 'Noor-e-Hira, Noor-e-Huda, Noor-e-Hidayat',
    credit: 'NooreHidayat.',
    license: 'NooreHidayat End User License Agreement',
    url: 'http://www.noorehidayat.org/',
  },
  { id: 'me-quran', title: 'me_quran', credit: 'Typeface and data © 2005 Meor Ridzuan.' },
  {
    id: 'amiri',
    title: 'Amiri Quran',
    credit: 'Amiri Font Project.',
    license: 'SIL Open Font License 1.1',
    url: 'http://www.amirifont.org',
  },
  {
    id: 'sil-arabic',
    title: 'Scheherazade New, Lateef',
    credit: 'SIL International.',
    license: 'SIL Open Font License 1.1',
    url: 'https://software.sil.org/scheherazade',
  },
  {
    id: 'noto-naskh',
    title: 'Noto Naskh Arabic',
    credit: 'Google Noto Fonts.',
    license: 'SIL Open Font License 1.1',
    url: 'https://fonts.google.com/noto',
  },
];

export const WORD_DATA_CREDITS: readonly SourceCredit[] = [
  {
    id: 'quran-com-wbw',
    title: 'Quran.com word-by-word',
    credit: 'Word-by-word translations from the Quran.com Content API, Quran Foundation.',
    usageKey: 'about_usage_word_by_word',
    url: 'https://quran.com',
  },
  {
    id: 'quran-com-transliteration',
    title: 'Quran.com transliteration',
    credit:
      'Transliteration (Quran.com translation resource 57) from the Quran.com Content API, Quran Foundation.',
    usageKey: 'about_usage_transliteration',
    url: 'https://quran.com',
  },
];

/** Translation resource id of the transliteration; credited above, so not listed as a translator. */
export const TRANSLITERATION_RESOURCE_ID = 57;
