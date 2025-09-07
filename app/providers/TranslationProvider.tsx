'use client';
import { I18nextProvider } from 'react-i18next';

import { i18n } from '../i18n';

/**
 * Wraps the `I18nextProvider` to supply translation services via `react-i18next`.
 * Use this provider to enable hooks like `useTranslation` for any nested components.
 */
export function TranslationProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
