'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';

export function NotFoundClient(): React.JSX.Element {
  const { t } = useTranslation();
  const rawPathname = usePathname();
  const locale = getLocaleFromPathname(rawPathname) ?? 'en';
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background text-foreground p-6">
      <h1 className="text-2xl font-semibold mb-4">{t('page_not_found')}</h1>
      <Link
        href={localizeHref('/', locale)}
        className="text-accent hover:text-accent-hover focus:text-accent-hover hover:underline"
      >
        {t('home')}
      </Link>
    </div>
  );
}

