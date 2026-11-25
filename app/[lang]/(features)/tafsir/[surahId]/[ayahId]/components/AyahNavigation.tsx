'use client';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from '@/app/shared/icons';
import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';
import type { UiLanguageCode } from '@/app/shared/i18n/uiLanguages';
import { usePublicPathname } from '@/app/shared/i18n/usePublicPathname';
import { buildSurahRoute, buildTafsirRoute, buildVerseRoute } from '@/app/shared/navigation/routes';
import { getTafsirReturnHref } from '@/app/shared/navigation/tafsirReturn';
import { formatNumber } from '@/lib/text/localizeNumbers';
import { Surah } from '@/types';

import type { TafsirNavTarget as NavTarget } from '@/app/[lang]/(features)/tafsir/hooks/useVerseNavigation';
import type { JSX } from 'react';

interface AyahNavigationProps {
  prev: NavTarget | null;
  next: NavTarget | null;
  currentSurah?: Surah | undefined;
  ayahId: string;
  surahId: string;
  /** Switches verse on the client; without it the links do a normal page navigation. */
  onNavigate?: ((target: NavTarget) => void) | undefined;
}

const ChevronLeft = (): JSX.Element => (
  <ChevronLeftIcon size={20} className="text-accent rtl:-scale-x-100" />
);

const ChevronRight = (): JSX.Element => (
  <ChevronRightIcon size={20} className="text-accent rtl:-scale-x-100" />
);

const buildTafsirUrl = (target: NavTarget): string =>
  buildTafsirRoute(target.surahId, target.ayahId);

interface NavLinkProps {
  label: string;
  target: NavTarget | null;
  side: 'left' | 'right';
  locale: UiLanguageCode;
  onNavigate?: ((target: NavTarget) => void) | undefined;
}

/** A plain left click; modified and middle clicks (new tab/window) stay with the browser. */
const isPlainClick = (event: React.MouseEvent<HTMLAnchorElement>): boolean =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey &&
  (!event.currentTarget.target || event.currentTarget.target === '_self');

const NavLink = ({ label, target, side, locale, onNavigate }: NavLinkProps): JSX.Element => {
  const baseClasses =
    'flex items-center px-1 py-2 sm:px-4 rounded-full bg-accent text-on-accent font-bold';
  const iconWrapperClasses =
    side === 'left'
      ? 'flex items-center justify-center w-9 h-9 rounded-full bg-surface me-0 sm:me-2'
      : 'flex items-center justify-center w-9 h-9 rounded-full bg-surface ms-0 sm:ms-2';

  if (!target) {
    return (
      <span aria-label={label} className={`${baseClasses} opacity-50 cursor-not-allowed`}>
        <div className={iconWrapperClasses}>
          {side === 'left' ? <ChevronLeft /> : <ChevronRight />}
        </div>
      </span>
    );
  }

  return (
    <Link
      href={localizeHref(buildTafsirUrl(target), locale)}
      // The click renders the verse from client data; no route payload is needed.
      prefetch={false}
      onClick={(event) => {
        if (!onNavigate || event.defaultPrevented || !isPlainClick(event)) return;
        event.preventDefault();
        onNavigate(target);
      }}
      rel={side === 'left' ? 'prev' : 'next'}
      aria-label={label}
      className={baseClasses}
    >
      <div className={iconWrapperClasses}>
        {side === 'left' ? <ChevronLeft /> : <ChevronRight />}
      </div>
    </Link>
  );
};

interface BackLinkProps {
  href: string;
  locale: UiLanguageCode;
}

const BackLink = ({ href, locale }: BackLinkProps): JSX.Element => (
  <Link
    href={localizeHref(href, locale)}
    prefetch={false}
    aria-label="Back"
    className="flex items-center px-1 sm:px-3 py-2 rounded-full bg-accent text-on-accent"
  >
    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-surface">
      <ArrowLeftIcon size={18} className="text-accent rtl:-scale-x-100" />
    </div>
  </Link>
);

const Title = ({
  currentSurah,
  surahId,
  ayahId,
  locale,
}: {
  currentSurah?: Surah | undefined;
  surahId: string;
  ayahId: string;
  locale: UiLanguageCode;
}): JSX.Element => {
  const { t, i18n } = useTranslation();
  const language = i18n?.language ?? 'en';
  const surahNumber = Number(surahId);
  const ayahNumber = Number(ayahId);

  const localizedSurahNumber =
    Number.isFinite(surahNumber) && surahNumber > 0
      ? formatNumber(surahNumber, language, { useGrouping: false })
      : surahId;

  const localizedAyahNumber =
    Number.isFinite(ayahNumber) && ayahNumber > 0
      ? formatNumber(ayahNumber, language, { useGrouping: false })
      : ayahId;

  const fallbackSurahName =
    currentSurah?.name?.trim() ||
    (localizedSurahNumber ? `${t('surah_tab')} ${localizedSurahNumber}` : t('surah_tab'));

  const surahName =
    Number.isFinite(surahNumber) && surahNumber > 0
      ? t(`surah_names.${surahNumber}`, fallbackSurahName)
      : fallbackSurahName;

  const reference =
    localizedSurahNumber && localizedAyahNumber
      ? `${localizedSurahNumber}:${localizedAyahNumber}`
      : localizedAyahNumber;

  return (
    <div className="flex-1 min-w-0 text-center px-2 text-on-accent font-bold text-sm sm:text-base truncate">
      <span className="font-bold">{surahName}</span>
      {reference ? (
        <>
          {' : '}
          {/* The reference links to the verse page, which links back here (crawl + context). */}
          <Link
            href={localizeHref(buildVerseRoute(surahId, ayahId), locale)}
            prefetch={false}
            className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-accent"
          >
            {reference}
          </Link>
        </>
      ) : null}
    </div>
  );
};

export const AyahNavigation = ({
  prev,
  next,
  currentSurah,
  ayahId,
  surahId,
  onNavigate,
}: AyahNavigationProps): JSX.Element => {
  const rawPathname = usePublicPathname();
  const locale = getLocaleFromPathname(rawPathname) ?? 'en';
  const backHref =
    getTafsirReturnHref() ?? buildSurahRoute(surahId, { startVerse: ayahId, forceSeq: true });

  return (
    <div className="flex w-full items-center justify-between gap-1 sm:gap-3 rounded-full bg-accent text-on-accent p-2 min-w-0 overflow-hidden">
      <BackLink href={backHref} locale={locale} />
      <Title currentSurah={currentSurah} surahId={surahId} ayahId={ayahId} locale={locale} />
      <div className="flex items-center gap-1 sm:gap-3">
        <NavLink
          label="Previous"
          target={prev}
          side="left"
          locale={locale}
          onNavigate={onNavigate}
        />
        <NavLink label="Next" target={next} side="right" locale={locale} onNavigate={onNavigate} />
      </div>
    </div>
  );
};
