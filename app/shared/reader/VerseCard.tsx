'use client';

import { forwardRef, memo, type ReactNode } from 'react';

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
}

const getVariantClasses = (variant: VerseCardVariant): string => {
  if (variant === 'contained') {
    return 'relative rounded-lg border border-border bg-surface p-6 shadow-sm';
  }

  return 'mb-8 pb-8 border-b border-border';
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
    },
    ref
  ) => {
    const { settings } = useSettings();
    const containerClasses = cn(getVariantClasses(variant), className);
    const fontSize = translationFontSize ?? settings.translationFontSize ?? 16;

    return (
      <div id={`${idPrefix}-${verse.id}`} ref={ref} className={containerClasses}>
        <div className="space-y-4 md:space-y-0 md:flex md:items-start md:gap-x-6">
          {actions ? (
            <ResponsiveVerseActions
              {...actions}
              className={cn('md:w-16 md:pt-1', actions?.className, actionsClassName)}
            />
          ) : null}

          <div className={cn('space-y-6 md:flex-grow', contentClassName)}>
            {showArabic ? <VerseArabic verse={verse} /> : null}

            {showTranslations && verse.translations?.length ? (
              <div className="space-y-4">
                {verse.translations.map((translation: Translation) => (
                  <div key={translation.resource_id}>
                    <p
                      className="text-left leading-relaxed text-foreground"
                      style={{ fontSize: `${fontSize}px` }}
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(translation.text) }}
                    />
                  </div>
                ))}
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
