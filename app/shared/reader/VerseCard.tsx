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
  /**
   * Extends the Arabic selection area into the WorkspaceMain right gutter.
   * Helps prevent accidental selection jumping when dragging into the gutter next to the sidebar.
   */
  extendArabicSelectionGutter?: boolean;
  showTranslations?: boolean;
  translationFontSize?: number;
  children?: ReactNode;
  footer?: ReactNode;
  idPrefix?: string;
  resourceLanguages?: Record<number, string>;
  /** When true, applies a highlight style to indicate the verse is being played */
  isPlaying?: boolean;
}

const getVariantClasses = (variant: VerseCardVariant, isPlaying?: boolean): string => {
  const playingHighlight = isPlaying
    ? 'bg-accent/5 rounded-lg transition-colors duration-300 px-3 -mx-3'
    : '';

  if (variant === 'contained') {
    const base = 'relative rounded-lg border border-border bg-surface p-6 shadow-sm';
    return isPlaying ? `${base} ring-2 ring-accent/30` : base;
  }

  // NOTE (virtualization): `react-virtuoso` measures item heights via `getBoundingClientRect()`,
  // which does NOT include margins. Avoid vertical margins/space-y between verse items (it causes
  // the list to miscalculate total height and makes end-of-list UI overlap). Use padding instead.
  const base = 'mb-0 pb-4 pt-4 md:pb-8 md:pt-6 border-b border-border';
  return `${base} ${playingHighlight}`.trim();
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
      extendArabicSelectionGutter = false,
      showTranslations = true,
      translationFontSize,
      children,
      footer,
      idPrefix = 'verse',
      resourceLanguages,
      isPlaying = false,
    },
    ref
  ) => {
    const { settings } = useSettings();
    const containerClasses = cn(getVariantClasses(variant, isPlaying), className);
    const fontSize = translationFontSize ?? settings.translationFontSize ?? 18;
    const arabicSelectionGutterClassName = extendArabicSelectionGutter
      ? '-mr-4 pr-1 sm:-mr-6 sm:pr-3 xl:-mr-6 xl:pr-3'
      : undefined;

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
            {showArabic ? (
              <VerseArabic verse={verse} className={arabicSelectionGutterClassName} />
            ) : null}

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
                          'text-left leading-relaxed text-slate-900 dark:text-slate-50',
                          isEnglish ? 'font-[family-name:var(--font-crimson-text)]' : ''
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
