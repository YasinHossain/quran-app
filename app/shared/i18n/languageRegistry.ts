/**
 * The single list of website languages. Routing (`proxy.ts`), the inline language script, `<html
 * lang/dir>`, hreflang alternates, robots metadata, the sitemap and the server-rendered reader
 * defaults all derive from it. Adding a language: see `docs/ADDING_A_LANGUAGE.md`.
 *
 * Content ids are published, scholarly translations from the Quran.com API (never machine
 * translated). The same per-language translation defaults ship in the mobile app
 * (`quran-app-mobile/src/data/initial-language-defaults.json`).
 */
export interface LanguageContentDefaults {
  /** Quran translation resource ids shown by default (empty: Arabic text only). */
  translationIds: ReadonlyArray<number>;
  /** Tafsir resource ids; the first is the server-rendered default. */
  tafsirIds: ReadonlyArray<number>;
  /**
   * Whether the default tafsir is written in this language. `false` (it falls back to another
   * language's tafsir) makes this language's tafsir pages duplicates: they are `noindex`, left out
   * of tafsir hreflang alternates, and get no tafsir sitemap. Only applies to an `indexable`
   * language (see `hasIndexableTafsir`).
   */
  hasOwnTafsir: boolean;
  /** Word-by-word gloss language. */
  wordLang: string;
  /** Word-by-word translation resource id used by the selector. */
  wordTranslationId: number;
}

export interface LanguageDefinition {
  /** URL prefix, i18next language and `<html lang>` (ISO 639-1). */
  code: string;
  /** English name, e.g. for admin/debug UI. */
  englishName: string;
  /** Name in the language itself, shown in language pickers. */
  nativeName: string;
  /** Text direction of the UI chrome. */
  dir: 'ltr' | 'rtl';
  /** `hreflang` value used in `<link rel="alternate">` and the sitemap. */
  hreflang: string;
  /** Disabled languages are not routed, listed, or put in the sitemap. */
  enabled: boolean;
  /**
   * Whether search engines should index this (enabled) language. `false` launches it for users
   * (routed, in pickers, normal pages) while keeping it out of search: its pages are
   * `noindex, follow`, it is left out of every hreflang alternate and the sitemap (so IndexNow,
   * which reads the sitemap, skips it too). New languages start `false`; see
   * `docs/ADDING_A_LANGUAGE.md`. The default language must stay indexable (it is `x-default`).
   */
  indexable: boolean;
  content: LanguageContentDefaults;
}

export const LANGUAGE_REGISTRY = [
  {
    code: 'en',
    englishName: 'English',
    nativeName: 'English',
    dir: 'ltr',
    hreflang: 'en',
    enabled: true,
    indexable: true,
    content: {
      translationIds: [20], // Saheeh International
      tafsirIds: [169], // Tafsir Ibn Kathir (abridged, English)
      hasOwnTafsir: true,
      wordLang: 'en',
      wordTranslationId: 85, // M.A.S. Abdel Haleem (used by the current WBW selector)
    },
  },
  {
    code: 'bn',
    englishName: 'Bangla',
    nativeName: 'বাংলা',
    dir: 'ltr',
    hreflang: 'bn',
    enabled: true,
    indexable: true,
    content: {
      translationIds: [161], // Taisirul Quran
      tafsirIds: [164], // Tafseer ibn Kathir (Bangla)
      hasOwnTafsir: true,
      wordLang: 'bn',
      wordTranslationId: 161, // Bengali entry from QDC resources list
    },
  },
  {
    code: 'ar',
    englishName: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    hreflang: 'ar',
    enabled: true,
    indexable: true,
    content: {
      translationIds: [], // Arabic readers get the Quran text itself; no translation line.
      tafsirIds: [14], // Tafsir Ibn Kathir (Arabic)
      hasOwnTafsir: true,
      // Word-by-word is not required for Arabic UI; keep English hover defaults.
      wordLang: 'en',
      wordTranslationId: 85,
    },
  },
  {
    code: 'ur',
    englishName: 'Urdu',
    nativeName: 'اردو',
    dir: 'rtl',
    hreflang: 'ur',
    enabled: true,
    indexable: true,
    content: {
      translationIds: [54], // Maulana Muhammad Junagarhi
      tafsirIds: [160], // Tafsir Ibn Kathir (Urdu)
      hasOwnTafsir: true,
      wordLang: 'ur',
      wordTranslationId: 54, // Urdu entry from QDC resources list
    },
  },
  {
    code: 'hi',
    englishName: 'Hindi',
    nativeName: 'हिन्दी',
    dir: 'ltr',
    hreflang: 'hi',
    enabled: true,
    indexable: true,
    content: {
      translationIds: [122], // Maulana Azizul Haque al-Umari
      tafsirIds: [169], // QDC has no Hindi tafsir resource; fall back to English.
      hasOwnTafsir: false,
      wordLang: 'hi',
      wordTranslationId: 122, // Hindi entry from QDC resources list
    },
  },
] as const satisfies ReadonlyArray<LanguageDefinition>;

export type UiLanguageCode = (typeof LANGUAGE_REGISTRY)[number]['code'];

/** Served without a URL prefix; also the `x-default` hreflang target. */
export const DEFAULT_UI_LANGUAGE = 'en' satisfies UiLanguageCode;

export const ENABLED_LANGUAGES: ReadonlyArray<(typeof LANGUAGE_REGISTRY)[number]> =
  LANGUAGE_REGISTRY.filter((language) => language.enabled);

export const ENABLED_LANGUAGE_CODES: ReadonlyArray<UiLanguageCode> = ENABLED_LANGUAGES.map(
  (language) => language.code
);

/** Enabled and open to search engines: hreflang, the sitemap and `index` robots derive from it. */
export function isIndexableLanguage(language: LanguageDefinition): boolean {
  return language.enabled && language.indexable;
}

/** Tafsir pages are indexable only in an indexable language whose default tafsir is its own. */
export function hasIndexableTafsir(language: LanguageDefinition): boolean {
  return isIndexableLanguage(language) && language.content.hasOwnTafsir;
}

/** Languages whose pages are indexed and listed as hreflang alternates and in the sitemap. */
export const INDEXABLE_LANGUAGES: ReadonlyArray<(typeof LANGUAGE_REGISTRY)[number]> =
  LANGUAGE_REGISTRY.filter(isIndexableLanguage);

/** Languages whose tafsir pages are indexable (see `hasIndexableTafsir`). */
export const TAFSIR_LANGUAGES: ReadonlyArray<(typeof LANGUAGE_REGISTRY)[number]> =
  LANGUAGE_REGISTRY.filter(hasIndexableTafsir);

export const RTL_LANGUAGE_CODES: ReadonlyArray<UiLanguageCode> = ENABLED_LANGUAGES.filter(
  (language) => language.dir === 'rtl'
).map((language) => language.code);

export function getLanguageDefinition(code: UiLanguageCode): LanguageDefinition {
  return (
    LANGUAGE_REGISTRY.find((language) => language.code === code) ??
    (LANGUAGE_REGISTRY[0] as LanguageDefinition)
  );
}

/** Request header the proxy sets with the resolved UI language for server components. */
export const UI_LANGUAGE_HEADER = 'x-ui-language';

/**
 * Query param the proxy adds to locale rewrites so Next's router caches keep RSC payloads apart
 * per language. Never part of a canonical URL.
 */
export const UI_LANGUAGE_QUERY_PARAM = '__uiLanguage';
