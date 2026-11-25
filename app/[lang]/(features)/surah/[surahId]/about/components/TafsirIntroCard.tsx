import Link from 'next/link';

import { localizeHref } from '@/app/shared/i18n/localeRouting';
import { ChevronRightIcon } from '@/app/shared/icons';
import { buildTafsirRoute } from '@/app/shared/navigation/routes';
import { isMostlyArabic, type TafsirIntro } from '@/lib/seo/tafsirIntro';
import { cn } from '@/lib/utils/cn';

import { ARABIC_QUOTE_FONT, focusRing, labelClass } from './aboutUi';

import type { ServerTranslator } from '@/app/shared/i18n/serverLocale';

export interface SurahTafsirIntro extends TafsirIntro {
  name: string | undefined;
  languageCode: string | undefined;
  /** Shown in English because the page language has no (loadable) edition. */
  inEnglish: boolean;
}

/** Languages whose own script is Arabic: quoted Arabic is not set apart there. */
const ARABIC_SCRIPT_LANGUAGES = new Set(['ar', 'ur', 'fa']);

/**
 * The opening of Tafsir Ibn Kathir's commentary on the surah, as quoted text (never as HTML).
 * Arabic quotations inside an English or Bangla tafsir are set apart, right-aligned.
 */
export function TafsirIntroCard({
  translator,
  surahId,
  intro,
}: {
  translator: ServerTranslator;
  surahId: number;
  intro: SurahTafsirIntro;
}): React.JSX.Element {
  const { locale } = translator;
  const lang = intro.languageCode ?? (intro.inEnglish ? 'en' : locale);
  const quotesArabic = !ARABIC_SCRIPT_LANGUAGES.has(lang);

  return (
    <section
      aria-labelledby="surah-about-tafsir"
      data-slot="surah-about-tafsir"
      className="relative overflow-hidden rounded-3xl border border-border bg-surface"
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 start-0 w-1 bg-gradient-to-b from-accent via-accent/60 to-accent/10"
      />
      <div className="space-y-5 p-6 sm:p-8">
        <header className="space-y-1">
          <p className={cn(labelClass(locale), 'text-accent')}>{intro.name}</p>
          <h2 id="surah-about-tafsir" className="text-xl font-semibold text-foreground sm:text-2xl">
            {translator.t('surah_about_tafsir_heading')}
          </h2>
          <p className="text-sm text-muted">{translator.t('surah_about_tafsir_sub')}</p>
          {intro.inEnglish ? (
            <p className="text-sm text-muted">{translator.t('surah_about_tafsir_english')}</p>
          ) : null}
        </header>

        <div lang={lang} className="relative space-y-3">
          {intro.blocks.map((block, index) => {
            if (block.kind === 'heading') {
              return (
                <h3 key={index} dir="auto" className="pt-2 font-semibold text-foreground">
                  {block.text}
                </h3>
              );
            }
            if (quotesArabic && isMostlyArabic(block.text)) {
              return (
                <p
                  key={index}
                  lang="ar"
                  dir="rtl"
                  className="border-s-2 border-accent/40 ps-4 text-start text-xl leading-loose text-foreground"
                  style={{ fontFamily: ARABIC_QUOTE_FONT }}
                >
                  {block.text}
                </p>
              );
            }
            return (
              <p key={index} dir="auto" className="leading-relaxed text-foreground/90">
                {block.text}
              </p>
            );
          })}
          {intro.truncated ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-surface to-transparent"
            />
          ) : null}
        </div>

        <Link
          href={localizeHref(buildTafsirRoute(surahId, 1), locale)}
          prefetch={false}
          className={cn(
            'inline-flex min-h-touch items-center gap-1.5 rounded-full bg-accent/10 px-5 text-sm font-semibold text-accent transition-colors hover:bg-accent/20',
            focusRing
          )}
        >
          {translator.t('verse_page_read_full_tafsir')}
          <ChevronRightIcon size={16} aria-hidden="true" className="rtl:rotate-180" />
        </Link>
      </div>
    </section>
  );
}
