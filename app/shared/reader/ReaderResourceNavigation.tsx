'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { MushafResourceKind } from '@/app/(features)/surah/hooks/mushafReadingViewTypes';

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

export function ReaderResourceNavigation({
  resourceKind,
  resourceId,
  className,
}: ReaderResourceNavigationProps): React.JSX.Element | null {
  const { t } = useTranslation();
  const router = useRouter();

  const current = toDisplayNumber(resourceId);
  const config = useMemo(() => {
    if (resourceKind === 'page') {
      return { label: t('page'), total: 604, prefix: '/page' } as const;
    }
    return { label: t('juz'), total: 30, prefix: '/juz' } as const;
  }, [resourceKind, t]);

  const handleNavigation = useCallback(
    (nextId: number) => {
      router.push(`${config.prefix}/${nextId}`);
    },
    [config.prefix, router]
  );

  if (!current) return null;

  const hasPrevious = current > 1;
  const hasNext = current < config.total;
  const prevId = hasPrevious ? current - 1 : null;
  const nextId = hasNext ? current + 1 : null;

  return (
    <div className={`flex w-full items-center justify-center py-8 ${className || ''}`}>
      <div className="inline-flex items-center gap-2 rounded-full bg-interactive p-1.5">
        <button
          onClick={() => prevId && handleNavigation(prevId)}
          disabled={!hasPrevious}
          data-testid={`previous-${resourceKind}-button`}
          className="group relative flex h-10 min-h-touch min-w-[130px] items-center justify-center rounded-full bg-surface px-8 text-sm font-medium text-foreground shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={
            prevId ? `${t('previous')} ${config.label} ${prevId}` : t('previous')
          }
        >
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-foreground">
            <ChevronLeft />
          </span>
          <span>{t('previous')}</span>
        </button>

        <button
          onClick={() => nextId && handleNavigation(nextId)}
          disabled={!hasNext}
          data-testid={`next-${resourceKind}-button`}
          className="group relative flex h-10 min-h-touch min-w-[130px] items-center justify-center rounded-full bg-surface px-8 text-sm font-medium text-foreground shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={nextId ? `${t('next')} ${config.label} ${nextId}` : t('next')}
        >
          <span>{t('next')}</span>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-foreground">
            <ChevronRight />
          </span>
        </button>
      </div>
    </div>
  );
}

