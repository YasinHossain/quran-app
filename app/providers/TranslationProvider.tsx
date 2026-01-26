'use client';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

import { createI18nWithResources, resolveInitialUiLanguage } from '@/app/i18n';
import { setUiLanguage } from '@/app/shared/i18n/setUiLanguage';
import type { UiLanguageCode } from '@/app/shared/i18n/uiLanguages';

import type { Resource } from 'i18next';

/**
 * Wraps the `I18nextProvider` to supply translation services via `react-i18next`.
 * Use this provider to enable hooks like `useTranslation` for any nested components.
 */
export function TranslationProvider({
  children,
  initialLanguage,
  resources,
}: {
  children: React.ReactNode;
  initialLanguage: string;
  resources?: Resource;
}): React.JSX.Element {
  const i18n = React.useMemo(() => {
    const fromProp = resolveInitialUiLanguage(initialLanguage);
    return createI18nWithResources(fromProp, resources ?? {});
  }, [initialLanguage, resources]);

  React.useEffect(() => {
    const language = resolveInitialUiLanguage(initialLanguage) as UiLanguageCode;

    // Keep document + cookies synchronized for middleware redirects and a11y.
    setUiLanguage(i18n, language);
  }, [i18n, initialLanguage]);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
