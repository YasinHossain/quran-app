/**
 * Maps supported language names to their ISO codes.
 *
 * @example
 * ```ts
 * const code = LANGUAGE_CODES['english']; // 'en'
 * ```
 */
export const LANGUAGE_CODES = {
  english: 'en',
  urdu: 'ur',
  bengali: 'bn',
  bangla: 'bn',
  turkish: 'tr',
  spanish: 'es',
  french: 'fr',
  bosnian: 'bs',
  russian: 'ru',
  malayalam: 'ml',
  indonesian: 'id',
  'bahasa indonesia': 'id',
  uzbek: 'uz',
  dutch: 'nl',
  german: 'de',
  tajik: 'tg',
  tamil: 'ta',
  japanese: 'ja',
  italian: 'it',
  vietnamese: 'vi',
  chinese: 'zh',
  albanian: 'sq',
  persian: 'fa',
  bulgarian: 'bg',
  bambara: 'bm',
  hausa: 'ha',
  portuguese: 'pt',
  romanian: 'ro',
  hindi: 'hi',
  swahili: 'sw',
  kazakh: 'kk',
  thai: 'th',
  tagalog: 'tl',
  'central khmer': 'km',
  assamese: 'as',
  korean: 'ko',
  somali: 'so',
  azeri: 'az',
  kurdish: 'ku',
  'divehi, dhivehi, maldivian': 'dv',
  malay: 'ms',
  dari: 'prs',
  amazigh: 'zgh',
  amharic: 'am',
  chechen: 'ce',
  czech: 'cs',
  finnish: 'fi',
  gujarati: 'gu',
  hebrew: 'he',
  georgian: 'ka',
  kannada: 'kn',
  kashmiri: 'ks',
  ganda: 'lg',
  macedonian: 'mk',
  marathi: 'mr',
  maranao: 'mrn',
  nepali: 'ne',
  norwegian: 'no',
  oromo: 'om',
  polish: 'pl',
  pashto: 'ps',
  kinyarwanda: 'rw',
  sindhi: 'sd',
  'northern sami': 'se',
  'sinhala, sinhalese': 'si',
  serbian: 'sr',
  swedish: 'sv',
  telugu: 'te',
  tatar: 'tt',
  'uighur, uyghur': 'ug',
  ukrainian: 'uk',
  yoruba: 'yo',
} as const;

export type LanguageCode = (typeof LANGUAGE_CODES)[keyof typeof LANGUAGE_CODES];

const LANGUAGE_CODE_VALUES = new Set<string>(Object.values(LANGUAGE_CODES));

export function toLanguageCode(value: string | null | undefined): LanguageCode | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const lower = trimmed.toLowerCase();
  const fromName = (LANGUAGE_CODES as Record<string, LanguageCode>)[lower];
  if (fromName) {
    return fromName;
  }

  if (LANGUAGE_CODE_VALUES.has(lower)) {
    return lower as LanguageCode;
  }

  if (LANGUAGE_CODE_VALUES.has(trimmed)) {
    return trimmed as LanguageCode;
  }

  return undefined;
}

export function ensureLanguageCode(
  value: string | null | undefined,
  fallback: LanguageCode = 'en'
): LanguageCode {
  return toLanguageCode(value) ?? fallback;
}
