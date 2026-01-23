'use client';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

import { createI18n, resolveInitialUiLanguage } from '@/app/i18n';
import { isUiLanguageCode, UI_LANGUAGE_STORAGE_KEY } from '@/app/shared/i18n/uiLanguages';

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
  const i18n = React.useMemo(() => {
    const fromProp = resolveInitialUiLanguage(initialLanguage);

    if (typeof window === 'undefined') {
      return createI18n(fromProp);
    }

    let fromClient: string | null = null;
    try {
      fromClient = window.localStorage.getItem(UI_LANGUAGE_STORAGE_KEY);
    } catch {}

    if (!fromClient) {
      try {
        const re = new RegExp(`(?:^|; )${UI_LANGUAGE_STORAGE_KEY}=([^;]+)`);
        const match = document.cookie.match(re);
        fromClient = match ? decodeURIComponent(match[1] ?? '') : null;
      } catch {}
    }

    if (!fromClient) {
      try {
        fromClient = document.documentElement.lang || null;
      } catch {}
    }

    const effective = fromClient && isUiLanguageCode(fromClient) ? fromClient : fromProp;
    return createI18n(effective);
  }, [initialLanguage]);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
