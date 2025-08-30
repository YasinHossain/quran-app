'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { ArabicText } from '../../atoms/text/ArabicText';
import { TranslationText } from '../../atoms/text/TranslationText';
import { VerseNumber } from '../../atoms/text/VerseNumber';
import type { Verse } from '@/src/domain/entities/Verse';

export interface VerseCardProps {
  verse: Verse;
  className?: string;
  showTranslation?: boolean;
  enableTajweed?: boolean;
  arabicFontSize?: number;
  translationFontSize?: number;
  fontFamily?: string;
  children?: React.ReactNode;
}

export const VerseCard = memo(
  ({
    verse,
    className,
    showTranslation = true,
    enableTajweed = false,
    arabicFontSize = 24,
    translationFontSize = 16,
    fontFamily,
    children,
  }: VerseCardProps) => {
    return (
      <div className={cn('space-y-4 p-4 border-b border-border', className)}>
        <div className="flex items-start gap-4">
          <VerseNumber number={verse.ayahNumber} />
          <div className="flex-1 space-y-4">
            <ArabicText
              text={verse.arabicText}
              enableTajweed={enableTajweed}
              size="lg"
              fontFamily={fontFamily}
            />
            {showTranslation && verse.translation && (
              <TranslationText text={verse.translation.text} fontSize={translationFontSize} />
            )}
          </div>
        </div>
        {children}
      </div>
    );
  }
);

VerseCard.displayName = 'VerseCard';
