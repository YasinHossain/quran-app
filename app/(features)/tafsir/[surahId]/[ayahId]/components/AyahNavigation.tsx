'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from '@/app/shared/icons';
import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';
import type { UiLanguageCode } from '@/app/shared/i18n/uiLanguages';
import { buildSurahRoute } from '@/app/shared/navigation/routes';
import { getTafsirReturnHref } from '@/app/shared/navigation/tafsirReturn';
import { formatNumber } from '@/lib/text/localizeNumbers';
import { Surah } from '@/types';

import type { JSX } from 'react';

interface NavTarget {
  surahId: string;
  ayahId: number;
}

interface AyahNavigationProps {
  prev: NavTarget | null;
  next: NavTarget | null;
  currentSurah?: Surah | undefined;
  ayahId: string;
  surahId: string;
}

const ChevronLeft = (): JSX.Element => <ChevronLeftIcon size={20} className="text-accent" />;

const ChevronRight = (): JSX.Element => <ChevronRightIcon size={20} className="text-accent" />;

const buildTafsirUrl = (target: NavTarget): string => `/tafsir/${target.surahId}/${target.ayahId}`;

interface NavLinkProps {
  label: string;
  target: NavTarget | null;
  side: 'left' | 'right';
  locale: UiLanguageCode;
}

const NavLink = ({ label, target, side, locale }: NavLinkProps): JSX.Element => {
  const baseClasses =
    'flex items-center px-1 py-2 sm:px-4 rounded-full bg-accent text-on-accent font-bold';
  const iconWrapperClasses =
    side === 'left'
      ? 'flex items-center justify-center w-9 h-9 rounded-full bg-surface mr-0 sm:mr-2'
      : 'flex items-center justify-center w-9 h-9 rounded-full bg-surface ml-0 sm:ml-2';

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
      prefetch={true}
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
    prefetch={true}
    aria-label="Back"
    className="flex items-center px-1 sm:px-3 py-2 rounded-full bg-accent text-on-accent"
  >
    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-surface">
      <ArrowLeftIcon size={18} className="text-accent" />
    </div>
  </Link>
);

const Title = ({
  currentSurah,
  surahId,
  ayahId,
}: {
  currentSurah?: Surah | undefined;
  surahId: string;
  ayahId: string;
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
      {reference ? ` : ${reference}` : null}
    </div>
  );
};

export const AyahNavigation = ({
  prev,
  next,
  currentSurah,
  ayahId,
  surahId,
}: AyahNavigationProps): JSX.Element => {
  const rawPathname = usePathname();
  const locale = getLocaleFromPathname(rawPathname) ?? 'en';
  const backHref =
    getTafsirReturnHref() ?? buildSurahRoute(surahId, { startVerse: ayahId, forceSeq: true });

  return (
    <div className="flex w-full items-center justify-between gap-1 sm:gap-3 rounded-full bg-accent text-on-accent p-2 min-w-0 overflow-hidden">
      <BackLink href={backHref} locale={locale} />
      <Title currentSurah={currentSurah} surahId={surahId} ayahId={ayahId} />
      <div className="flex items-center gap-1 sm:gap-3">
        <NavLink label="Previous" target={prev} side="left" locale={locale} />
        <NavLink label="Next" target={next} side="right" locale={locale} />
      </div>
    </div>
  );
};
