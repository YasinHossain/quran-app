import { isUiLanguageCode, type UiLanguageCode } from '@/app/shared/i18n/uiLanguages';

import { ClientProviders } from '@/app/providers/ClientProviders';
import { TranslationProvider } from '@/app/providers/TranslationProvider';
import { ErrorBoundary } from '@/app/shared/components/error-boundary';

export const dynamicParams = false;

export function generateStaticParams(): Array<{ lang: UiLanguageCode }> {
  return [{ lang: 'en' }, { lang: 'bn' }];
}

function resolveLang(value: string | undefined): UiLanguageCode {
  return value && isUiLanguageCode(value) ? value : 'en';
}

export default function LanguageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}): React.JSX.Element {
  const lang = resolveLang(params.lang);

  return (
    <ErrorBoundary>
      <TranslationProvider initialLanguage={lang}>
        <ClientProviders initialTheme="light" initialUiLanguage={lang}>
          {children}
        </ClientProviders>
      </TranslationProvider>
    </ErrorBoundary>
  );
}
