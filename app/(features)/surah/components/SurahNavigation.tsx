'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';
import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';
import { buildSurahRoute } from '@/app/shared/navigation/routes';

interface SurahNavigationProps {
  currentSurahId: number;
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

const SURAH_COUNT = 114;

const NAV_ITEM_CLASS_NAME =
  'group relative flex h-10 min-h-touch min-w-[130px] items-center justify-center rounded-full bg-surface px-8 text-sm font-medium text-foreground shadow-sm transition-all';
const NAV_ITEM_DISABLED_CLASS_NAME = 'cursor-not-allowed opacity-50';

/**
 * Navigation component for moving between surahs.
 * Displays Previous and Next links at the end of each surah. They are plain links (crawlable,
 * rendered on the server); chapter names only enrich the accessible labels once loaded.
 */
export function SurahNavigation({
  currentSurahId,
  className,
}: SurahNavigationProps): React.JSX.Element | null {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { chapters } = useSurahNavigationData();
  const locale = getLocaleFromPathname(pathname) ?? 'en';

  if (!Number.isInteger(currentSurahId) || currentSurahId < 1 || currentSurahId > SURAH_COUNT) {
    return null;
  }

  const previousId = currentSurahId > 1 ? currentSurahId - 1 : null;
  const nextId = currentSurahId < SURAH_COUNT ? currentSurahId + 1 : null;
  const nameOf = (id: number): string =>
    t(`surah_names.${id}`, {
      defaultValue: chapters.find((chapter) => chapter.id === id)?.name_simple ?? String(id),
    });

  const previousContent = (
    <>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-foreground">
        <ChevronLeft />
      </span>
      <span>{t('previous')}</span>
    </>
  );
  const nextContent = (
    <>
      <span>{t('next')}</span>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-foreground">
        <ChevronRight />
      </span>
    </>
  );

  return (
    <nav className={`flex w-full items-center justify-center py-8 ${className || ''}`}>
      <div className="inline-flex items-center gap-2 rounded-full bg-interactive p-1.5">
        {previousId ? (
          <Link
            href={localizeHref(buildSurahRoute(previousId), locale)}
            data-testid="previous-surah-button"
            className={NAV_ITEM_CLASS_NAME}
            aria-label={`${t('previous')}: ${nameOf(previousId)}`}
          >
            {previousContent}
          </Link>
        ) : (
          <span
            aria-disabled="true"
            data-testid="previous-surah-button"
            className={`${NAV_ITEM_CLASS_NAME} ${NAV_ITEM_DISABLED_CLASS_NAME}`}
          >
            {previousContent}
          </span>
        )}

        {nextId ? (
          <Link
            href={localizeHref(buildSurahRoute(nextId), locale)}
            data-testid="next-surah-button"
            className={NAV_ITEM_CLASS_NAME}
            aria-label={`${t('next')}: ${nameOf(nextId)}`}
          >
            {nextContent}
          </Link>
        ) : (
          <span
            aria-disabled="true"
            data-testid="next-surah-button"
            className={`${NAV_ITEM_CLASS_NAME} ${NAV_ITEM_DISABLED_CLASS_NAME}`}
          >
            {nextContent}
          </span>
        )}
      </div>
    </nav>
  );
}
