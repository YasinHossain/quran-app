import { headers } from 'next/headers';

import { loadUiResources, resolveUiLanguageFromHeader } from '@/app/shared/i18n/loadUiResources';
import { localizeHref } from '@/app/shared/i18n/localeRouting';
import { buildSurahRoute } from '@/app/shared/navigation/routes';
import { buildTextClasses } from '@/app/shared/design-system/card-tokens';
import { renderCSS } from '@/app/shared/ui/base-card/renderers.css-renderer';
import { useBaseCard as getBaseCard } from '@/app/shared/ui/base-card.utils';
import { formatNumber } from '@/lib/text/localizeNumbers';

import type { UiLanguageCode } from '@/app/shared/i18n/uiLanguages';
import type { Chapter } from '@/types';

interface SurahGridStaticServerProps {
  chapters: ReadonlyArray<Chapter>;
  className?: string;
}

type TranslationJson = Record<string, unknown>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const resolveString = (value: unknown): string | undefined => (typeof value === 'string' ? value : undefined);

const resolveSurahNames = (translation: TranslationJson): Record<string, string> => {
  const surahNames = translation['surah_names'];
  if (!isRecord(surahNames)) return {};

  const entries = Object.entries(surahNames).flatMap(([key, value]) => {
    const resolved = resolveString(value);
    return resolved ? [[key, resolved] as const] : [];
  });

  return Object.fromEntries(entries);
};

const SurahCardStaticServer = ({
  chapter,
  locale,
  surahNames,
  versesLabel,
}: {
  chapter: Chapter;
  locale: UiLanguageCode;
  surahNames: Record<string, string>;
  versesLabel: string;
}): React.JSX.Element => {
  const title = surahNames[String(chapter.id)] ?? chapter.name_simple;
  const versesCount = formatNumber(chapter.verses_count, locale, { useGrouping: false });
  const subtitle = `${versesCount} ${versesLabel}`;

  const { commonProps } = getBaseCard({
    href: localizeHref(buildSurahRoute(chapter.id), locale),
    scroll: true,
    prefetch: true,
    variant: 'navigation',
    animation: 'navigation',
    className: 'items-center w-full',
    children: (
      <>
        <div
          className={[
            'flex items-center justify-center rounded-xl font-bold transition-colors',
            'w-12 h-12 text-lg',
            'bg-number-badge text-accent group-hover:bg-number-badge-hover',
          ].join(' ')}
        >
          {formatNumber(chapter.id, locale, { useGrouping: false })}
        </div>
        <div className="flex-grow min-w-0">
          <p className={`font-bold ${buildTextClasses('primary', false)} truncate`}>{title}</p>
          <p className={`${buildTextClasses('secondary', false)} truncate whitespace-nowrap`}>
            {subtitle}
          </p>
        </div>
        <p className={buildTextClasses('arabic', false)}>{chapter.name_arabic}</p>
      </>
    ),
  });

  return renderCSS(commonProps);
};

export async function SurahGridStaticServer({
  chapters,
  className,
}: SurahGridStaticServerProps): Promise<React.JSX.Element> {
  const headerStore = await headers();
  const locale = resolveUiLanguageFromHeader(headerStore.get('x-ui-language'));
  const resources = await loadUiResources(locale);

  const translationRaw = resources[locale]?.['translation'] ?? resources['en']?.['translation'];
  const translation = isRecord(translationRaw) ? (translationRaw as TranslationJson) : {};
  const surahNames = resolveSurahNames(translation);
  const versesLabel = resolveString(translation['verses']) ?? 'verses';

  return (
    <div
      className={[
        'grid w-full auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        'gap-y-2.5 md:gap-y-3 xl:gap-y-4 gap-x-2.5 md:gap-x-3 xl:gap-x-4',
        className ? `pb-4 ${className}` : 'pb-4',
      ].join(' ')}
    >
      {chapters.map((chapter) => (
        <SurahCardStaticServer
          key={chapter.id}
          chapter={chapter}
          locale={locale}
          surahNames={surahNames}
          versesLabel={versesLabel}
        />
      ))}
    </div>
  );
}
