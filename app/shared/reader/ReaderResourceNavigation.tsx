'use client';

import Link from 'next/link';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';
import { usePublicPathname } from '@/app/shared/i18n/usePublicPathname';

import type { MushafResourceKind } from '@/app/[lang]/(features)/surah/hooks/mushafReadingViewTypes';

interface ReaderResourceNavigationProps {
  resourceKind: Exclude<MushafResourceKind, 'surah'>;
  resourceId: string;
  className?: string;
}

const ChevronLeft = (): React.JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M11.707 15.293a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L8.414 10l3.293 3.293a1 1 0 001.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronRight = (): React.JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M8.293 4.707a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L11.586 10l-3.293-3.293a1 1 0 00-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const toDisplayNumber = (value: string): number | null => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const NAV_ITEM_CLASS_NAME =
  'group relative flex h-10 min-h-touch min-w-[130px] items-center justify-center rounded-full bg-surface px-8 text-sm font-medium text-foreground shadow-sm transition-all';
const NAV_ITEM_DISABLED_CLASS_NAME = 'cursor-not-allowed opacity-50';

export function ReaderResourceNavigation({
  resourceKind,
  resourceId,
  className,
}: ReaderResourceNavigationProps): React.JSX.Element | null {
  const { t } = useTranslation();
  const pathname = usePublicPathname();
  const locale = getLocaleFromPathname(pathname) ?? 'en';

  const current = toDisplayNumber(resourceId);
  const config = useMemo(() => {
    if (resourceKind === 'page') {
      return { label: t('page'), total: 604, prefix: '/page' } as const;
    }
    return { label: t('juz'), total: 30, prefix: '/juz' } as const;
  }, [resourceKind, t]);

  if (!current) return null;

  const prevId = current > 1 ? current - 1 : null;
  const nextId = current < config.total ? current + 1 : null;

  const previousContent = (
    <>
      <span className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-foreground">
        <ChevronLeft />
      </span>
      <span>{t('previous')}</span>
    </>
  );
  const nextContent = (
    <>
      <span>{t('next')}</span>
      <span className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-foreground">
        <ChevronRight />
      </span>
    </>
  );

  // Plain links so previous/next are crawlable and present in server HTML.
  return (
    <nav
      aria-label={config.label}
      className={`flex w-full items-center justify-center py-8 ${className || ''}`}
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-interactive p-1.5">
        {prevId ? (
          <Link
            href={localizeHref(`${config.prefix}/${prevId}`, locale)}
            data-testid={`previous-${resourceKind}-button`}
            className={NAV_ITEM_CLASS_NAME}
            aria-label={`${t('previous')} ${config.label} ${prevId}`}
          >
            {previousContent}
          </Link>
        ) : (
          <span
            aria-disabled="true"
            data-testid={`previous-${resourceKind}-button`}
            className={`${NAV_ITEM_CLASS_NAME} ${NAV_ITEM_DISABLED_CLASS_NAME}`}
          >
            {previousContent}
          </span>
        )}

        {nextId ? (
          <Link
            href={localizeHref(`${config.prefix}/${nextId}`, locale)}
            data-testid={`next-${resourceKind}-button`}
            className={NAV_ITEM_CLASS_NAME}
            aria-label={`${t('next')} ${config.label} ${nextId}`}
          >
            {nextContent}
          </Link>
        ) : (
          <span
            aria-disabled="true"
            data-testid={`next-${resourceKind}-button`}
            className={`${NAV_ITEM_CLASS_NAME} ${NAV_ITEM_DISABLED_CLASS_NAME}`}
          >
            {nextContent}
          </span>
        )}
      </div>
    </nav>
  );
}
