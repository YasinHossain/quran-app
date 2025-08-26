'use client';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background text-foreground p-6">
      <h1 className="text-2xl font-semibold mb-4">{t('page_not_found')}</h1>
      <Link
        href="/"
        className="text-accent hover:text-accent-hover focus:text-accent-hover hover:underline"
      >
        {t('home')}
      </Link>
    </div>
  );
}
