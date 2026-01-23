const DIGIT_MAPS: Record<string, readonly string[]> = {
  bn: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'],
  hi: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  ar: ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'],
  ur: ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'],
  fa: ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'],
} as const;

const LOCALE_OVERRIDES: Record<string, string> = {
  bn: 'bn-BD',
  hi: 'hi-IN',
  ar: 'ar',
  ur: 'ur-PK',
  fa: 'fa-IR',
} as const;

const normalizeLanguageCode = (languageCode: string): string =>
  (languageCode || '').toLowerCase().split(/[-_]/)[0] ?? '';

const getDigitMap = (languageCode: string): readonly string[] | null => {
  const base = normalizeLanguageCode(languageCode);
  return DIGIT_MAPS[base] ?? null;
};

const resolveLocale = (languageCode: string): string => {
  const base = normalizeLanguageCode(languageCode);
  return LOCALE_OVERRIDES[base] ?? languageCode;
};

export const localizeDigits = (value: string, languageCode: string): string => {
  const map = getDigitMap(languageCode);
  if (!map) return value;

  return value.replace(/\d/g, (digit) => {
    const index = Number(digit);
    return Number.isInteger(index) && index >= 0 && index <= 9 ? map[index]! : digit;
  });
};

export const formatNumber = (
  value: number,
  languageCode: string,
  options?: Intl.NumberFormatOptions
): string => {
  try {
    const locale = resolveLocale(languageCode);
    const formatted = new Intl.NumberFormat(locale, options).format(value);
    return localizeDigits(formatted, languageCode);
  } catch {
    return localizeDigits(String(value), languageCode);
  }
};
