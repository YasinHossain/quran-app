import i18next, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { isUiLanguageCode, type UiLanguageCode } from '@/app/shared/i18n/uiLanguages';
import { formatNumber } from '@/lib/text/localizeNumbers';
import commonBn from '@/public/locales/bn/common.json';
import playerBn from '@/public/locales/bn/player.json';
import commonEn from '@/public/locales/en/common.json';
import playerEn from '@/public/locales/en/player.json';

export function resolveInitialUiLanguage(value: string | undefined | null): UiLanguageCode {
  return value && isUiLanguageCode(value) ? value : 'en';
}

// Some Jest tests mock `react-i18next` without providing `initReactI18next`.
// Fall back to a no-op plugin so importing this module never crashes in tests.
const reactI18nextPlugin =
  initReactI18next ??
  ({
    type: '3rdParty',
    init: () => {},
  } as const);

export function createI18n(initialLanguage: string): I18nInstance {
  const instance = i18next.createInstance();
  const lng = resolveInitialUiLanguage(initialLanguage);

  // `initImmediate: false` is important for SSR so translations are available
  // synchronously during the render pass (prevents "default language" flashes).
  instance.use(reactI18nextPlugin).init({
    initImmediate: false,
    resources: {
      en: { translation: commonEn, player: playerEn },
      bn: { translation: commonBn, player: playerBn },
    },
    ns: ['translation', 'player'],
    defaultNS: 'translation',
    lng,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
      format: (value, format, language) => {
        if (typeof value !== 'number') return String(value);
        const languageCode = typeof language === 'string' ? language : 'en';
        if (format === 'number-group') {
          return formatNumber(value, languageCode, { useGrouping: true });
        }
        if (format === 'number') {
          return formatNumber(value, languageCode, { useGrouping: false });
        }
        return String(value);
      },
    },
  });

  return instance;
}
