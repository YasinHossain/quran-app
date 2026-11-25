import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';
import { usePublicPathname } from '@/app/shared/i18n/usePublicPathname';
import { InfoIcon } from '@/app/shared/icons';
import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';
import { buildSurahAboutRoute } from '@/app/shared/navigation/routes';
import { useReaderServerChapter } from '@/app/shared/reader/ReaderServerData';
import { formatNumber } from '@/lib/text/localizeNumbers';
import { cn } from '@/lib/utils/cn';

type SurahIntroDetails = {
  revelationPlace?: string | undefined;
  showBismillah: boolean;
  chapterId: number;
  surahName: string;
  versesCount?: number | undefined;
};

const useSurahIntroDetails = (chapterId?: number | null): SurahIntroDetails | null => {
  const { chapters } = useSurahNavigationData();
  // Chapter metadata fetched by the server route; the client chapter list is empty during SSR.
  const serverChapter = useReaderServerChapter(chapterId);

  if (!chapterId) return null;

  const chapter = serverChapter ?? chapters.find((item) => item.id === chapterId);
  const surahName = chapter?.name_simple ?? `Surah ${chapterId}`;
  const versesCount = chapter?.verses_count; // unknown stays blank, never guessed

  return {
    revelationPlace: chapter?.revelation_place,
    showBismillah: chapterId !== 9 && chapterId !== 1,
    chapterId: chapter?.id ?? chapterId,
    surahName,
    versesCount,
  };
};

const revelationLabel = (place?: string): string | null =>
  place === 'makkah' ? 'مكية' : place === 'madinah' ? 'مدنية' : null;

const DOT = (
  <span aria-hidden="true" className="text-muted-foreground/50">
    ·
  </span>
);

const AboutLink = ({ chapterId }: { chapterId: number }): React.JSX.Element => {
  const { t } = useTranslation();
  const pathname = usePublicPathname();
  const href = localizeHref(
    buildSurahAboutRoute(chapterId),
    getLocaleFromPathname(pathname) ?? 'en'
  );
  const description = t('surah_about_link');

  return (
    <Link
      href={href}
      prefetch={false}
      data-slot="surah-about-link"
      title={description}
      className="group -my-2 inline-flex min-h-touch items-center rounded-full focus-visible:outline-none"
    >
      <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2.5 text-xs font-medium text-muted-foreground transition-colors group-hover:bg-foreground/10 group-hover:text-foreground group-focus-visible:ring-2 group-focus-visible:ring-accent">
        <InfoIcon size={13} aria-hidden="true" />
        {t('info')}
        <span className="sr-only">: {description}</span>
      </span>
    </Link>
  );
};

const SurahIntroMeta = ({
  place,
  versesLabel,
  chapterId,
}: {
  place: string | null;
  versesLabel: string | null;
  chapterId: number;
}): React.JSX.Element => (
  <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2 text-xs text-muted-foreground sm:text-sm">
    {place ? (
      <>
        <span
          className="text-base text-foreground/80 sm:text-lg"
          style={{ fontFamily: "'UthmanicHafs1Ver18', serif", lineHeight: 1 }}
        >
          {place}
        </span>
        {DOT}
      </>
    ) : null}
    {versesLabel ? (
      <>
        <span>{versesLabel}</span>
        {DOT}
      </>
    ) : null}
    <AboutLink chapterId={chapterId} />
  </div>
);

export const SurahCalligraphyIntro = ({
  chapterId,
  className,
}: {
  chapterId?: number | null | undefined;
  className?: string;
}): React.JSX.Element | null => {
  const { t, i18n } = useTranslation();
  const introDetails = useSurahIntroDetails(chapterId);

  if (!introDetails) return null;

  const surahName = t(`surah_names.${introDetails.chapterId}`, {
    defaultValue: introDetails.surahName,
  });
  const versesLabel =
    typeof introDetails.versesCount === 'number'
      ? `${formatNumber(introDetails.versesCount, i18n.language)} ${t('verses')}`
      : null;

  return (
    <div
      className={cn(
        'mx-auto -mt-4 flex w-full max-w-7xl flex-col items-center border-b border-border/40 px-1 pb-6 sm:-mt-3 sm:pt-6 sm:pb-9',
        className
      )}
    >
      <h1
        className="text-xl font-semibold text-foreground sm:text-2xl"
        style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}
      >
        {surahName}
      </h1>
      <SurahIntroMeta
        place={revelationLabel(introDetails.revelationPlace)}
        versesLabel={versesLabel}
        chapterId={introDetails.chapterId}
      />
      {introDetails.showBismillah ? (
        <p
          dir="rtl"
          className="mt-4 text-center text-3xl leading-none text-foreground sm:mt-6 sm:text-4xl"
          style={{ fontFamily: "'UthmanicHafs1Ver18', serif" }}
        >
          ﷽
        </p>
      ) : null}
    </div>
  );
};
