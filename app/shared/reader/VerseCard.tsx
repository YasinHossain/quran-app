'use client';

import { forwardRef, memo, useMemo, type ReactNode } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { ResponsiveVerseActions } from '@/app/shared/ResponsiveVerseActions';
import { VerseArabic } from '@/app/shared/VerseArabic';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { cn } from '@/lib/utils/cn';

import type { VerseActionsProps } from '@/app/shared/verse-actions';
import type { Translation, Verse as VerseType } from '@/types';

type VerseCardVariant = 'separated' | 'contained';

export interface ReaderVerseCardProps {
  verse: VerseType;
  actions?: VerseActionsProps | null;
  variant?: VerseCardVariant;
  className?: string;
  actionsClassName?: string;
  contentClassName?: string;
  showArabic?: boolean;
  showTranslations?: boolean;
  translationFontSize?: number;
  children?: ReactNode;
  footer?: ReactNode;
  idPrefix?: string;
  resourceLanguages?: Record<number, string>;
}

const getVariantClasses = (variant: VerseCardVariant): string => {
  if (variant === 'contained') {
    return 'relative rounded-lg border border-border bg-surface p-6 shadow-sm';
  }

  return 'mb-0 pb-4 pt-4 md:mb-8 md:pb-8 md:pt-0 border-b border-border';
};

const ReaderVerseCardComponent = forwardRef<HTMLDivElement, ReaderVerseCardProps>(
  (
    {
      verse,
      actions = null,
      variant = 'separated',
      className,
      actionsClassName,
      contentClassName,
      showArabic = true,
      showTranslations = true,
      translationFontSize,
      children,
      footer,
      idPrefix = 'verse',
      resourceLanguages,
    },
    ref
  ) => {
    const { settings } = useSettings();
    const containerClasses = cn(getVariantClasses(variant), className);
    const fontSize = translationFontSize ?? settings.translationFontSize ?? 18;

    const sortedTranslations = useMemo(() => {
      if (!verse.translations || verse.translations.length === 0) {
        return [];
      }

      if (!settings.translationIds) {
        return verse.translations;
      }

      if (settings.translationIds.length === 0) {
        return [];
      }

      // Create a set for O(1) lookup of selected translation IDs
      const selectedIdsSet = new Set(settings.translationIds);

      // Create order map for sorting
      const orderMap = new Map<number, number>();
      settings.translationIds.forEach((id, index) => {
        orderMap.set(id, index);
      });

      // Filter to only include selected translations, then sort by order
      return verse.translations
        .filter((t) => selectedIdsSet.has(t.resource_id))
        .sort((a, b) => {
          const indexA = orderMap.get(a.resource_id) ?? 9999;
          const indexB = orderMap.get(b.resource_id) ?? 9999;
          return indexA - indexB;
        });
    }, [verse.translations, settings.translationIds]);

    return (
      <div id={`${idPrefix}-${verse.id}`} ref={ref} className={containerClasses}>
        <div className="space-y-4 md:space-y-0 md:flex md:items-stretch md:gap-x-6">
          {actions ? (
            <ResponsiveVerseActions
              {...actions}
              className={cn(
                'md:w-16 md:h-full md:flex md:flex-col md:justify-center',
                actions?.className,
                actionsClassName
              )}
            />
          ) : null}

          <div className={cn('space-y-6 md:flex-grow', contentClassName)}>
            {showArabic ? <VerseArabic verse={verse} /> : null}

            {showTranslations && sortedTranslations.length ? (
              <div className="space-y-6">
                {sortedTranslations.map((translation: Translation) => {
                  const lang = resourceLanguages?.[translation.resource_id];
                  const isEnglish = lang === 'en';
                  return (
                    <div key={translation.resource_id} className="group">
                      {translation.resource_name && (
                        <p className="mb-2 text-xs font-normal uppercase tracking-wider text-muted-foreground">
                          {translation.resource_name}
                        </p>
                      )}
                      <p
                        className={cn(
                          "text-left leading-relaxed text-slate-900 dark:text-slate-50",
                          isEnglish ? "font-[family-name:var(--font-crimson-text)]" : ""
                        )}
                        lang={lang}
                        dir="auto"
                        style={{ fontSize: `${fontSize}px` }}
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(translation.text) }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : null}

            {children}
          </div>
        </div>

        {footer}
      </div>
    );
  }
);

ReaderVerseCardComponent.displayName = 'ReaderVerseCard';

export const ReaderVerseCard = memo(ReaderVerseCardComponent);
