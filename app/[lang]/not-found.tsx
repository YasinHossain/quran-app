'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const normalizeLocaleHomeHref = (pathname: string | null): string => {
  const path = pathname ?? '';
  const match = path.match(/^\/(en|bn)(?:\/|$)/);
  const locale = match?.[1] ?? 'en';
  return `/${locale}`;
};

export default function NotFound(): React.JSX.Element {
  const pathname = usePathname();
  const homeHref = useMemo(() => normalizeLocaleHomeHref(pathname), [pathname]);
  const { t } = useTranslation();

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background text-foreground p-6">
      <h1 className="text-2xl font-semibold mb-4">{t('page_not_found')}</h1>
      <Link
        href={homeHref}
        className="text-accent hover:text-accent-hover focus:text-accent-hover hover:underline"
      >
        {t('home')}
      </Link>
    </div>
  );
}

