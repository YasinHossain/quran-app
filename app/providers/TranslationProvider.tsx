'use client';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

import { createI18n, resolveInitialUiLanguage } from '@/app/i18n';

/**
 * Wraps the `I18nextProvider` to supply translation services via `react-i18next`.
 * Use this provider to enable hooks like `useTranslation` for any nested components.
 */
export function TranslationProvider({
  children,
  initialLanguage,
}: {
  children: React.ReactNode;
  initialLanguage: string;
}): React.JSX.Element {
  const i18n = React.useMemo(
    () => createI18n(resolveInitialUiLanguage(initialLanguage)),
    [initialLanguage]
  );
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
