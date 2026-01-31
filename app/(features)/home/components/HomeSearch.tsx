'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';
import { buildSurahRoute } from '@/app/shared/navigation/routes';
import { ComprehensiveSearch } from '@/app/shared/search';

interface HomeSearchProps {
  /** Search query for filtering (passed to parent for tab filtering) */
  searchQuery?: string;
  /** Callback when search query changes (for tab filtering) */
  setSearchQuery?: (value: string) => void;
  /** Additional CSS class */
  className?: string;
}

const SHORTCUT_SURAHS = [
  { id: 67, fallbackName: 'Al-Mulk' },
  { id: 18, fallbackName: 'Al-Kahf' },
  { id: 36, fallbackName: 'Ya-Sin' },
  { id: 112, fallbackName: 'Al-Ikhlas' },
];

/**
 * Home search component with comprehensive search functionality.
 * Features advanced search with instant results, navigation detection,
 * and quick Surah shortcuts.
 */
export const HomeSearch = memo(function HomeSearch({ className }: HomeSearchProps): ReactElement {
  const { t } = useTranslation();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? 'en';

  return (
    <div className={`w-full space-y-4 md:space-y-5 ${className ?? ''}`}>
      {/* Comprehensive Search */}
      <div className="w-full">
        <ComprehensiveSearch variant="home" placeholder={t('search_placeholder')} />
      </div>

      {/* Shortcut buttons */}
      <div className="w-full mx-auto" style={{ maxWidth: 'clamp(14rem, 65vw, 28rem)' }}>
        <div className="flex flex-nowrap justify-center items-center gap-1 sm:gap-1.5 md:gap-2">
          {SHORTCUT_SURAHS.map(({ id, fallbackName }) => (
            <Link
              key={id}
              href={localizeHref(buildSurahRoute(id), locale)}
              className="flex-shrink-0 min-h-[2rem] sm:min-h-[2.25rem] md:min-h-10 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full font-medium text-[0.65rem] sm:text-xs md:text-sm transition-all duration-200 bg-surface-navigation text-foreground hover:bg-surface-navigation/90 border border-border/30 dark:border-border/20 shadow-sm hover:shadow-md active:scale-95 touch-manipulation flex items-center justify-center"
            >
              {t(`surah_names.${id}`, fallbackName)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
});
