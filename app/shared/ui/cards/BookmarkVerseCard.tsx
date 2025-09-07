'use client';

import { cn } from '@/lib/utils/cn';
import { parseVerseKey } from '@/lib/utils/verse';

import { BaseCard, BaseCardProps } from '../BaseCard';

import type { Bookmark } from '@/types/bookmark';

/**
 * BookmarkVerseCard
 *
 * Specialized verse card for bookmark folder contents that maintains current design
 * while using the unified BaseCard system for consistent behavior.
 */

interface BookmarkVerseCardProps extends Omit<BaseCardProps, 'children'> {
  bookmark: Bookmark;
}

export const BookmarkVerseCard = ({
  bookmark,
  className,
  ...props
}: BookmarkVerseCardProps): React.JSX.Element => {
  const { surahNumber, ayahNumber } = parseVerseKey(bookmark.verseKey);

  return (
    <BaseCard
      variant="navigation" // Use navigation variant for consistent hover
      animation="navigation"
      className={cn(
        // Override with verse-specific styles while maintaining base behavior
        'p-2.5 rounded-lg border transition-all duration-200 cursor-pointer group h-auto',
        'bg-surface/60 border-border/60 hover:border-accent/30 hover:bg-surface-hover hover:shadow-sm',
        'min-h-0', // Allow shrinking
        className as string
      )}
      {...props}
    >
      <div className="flex items-start space-x-2.5">
        {/* Verse indicator */}
        <div className="flex-shrink-0 w-7 h-7 rounded-md bg-accent/10 text-accent flex items-center justify-center text-xs font-semibold group-hover:bg-accent/15">
          {ayahNumber}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Surah info */}
          <div className="text-xs font-semibold text-foreground truncate">
            {bookmark.surahName || `Surah ${surahNumber}`}
          </div>

          {/* Verse key */}
          <div className="text-xs text-muted/80 leading-tight">
            {bookmark.verseKey || `${surahNumber}:${ayahNumber}`}
          </div>

          {/* Optional verse preview - only show translation or first few words */}
          {(bookmark.translation || bookmark.verseText) && (
            <div className="text-xs text-muted-foreground mt-1 line-clamp-1 leading-tight">
              {bookmark.translation
                ? bookmark.translation.length > 50
                  ? `${bookmark.translation.substring(0, 50)}...`
                  : bookmark.translation
                : bookmark.verseText && bookmark.verseText.length > 40
                  ? `${bookmark.verseText.substring(0, 40)}...`
                  : bookmark.verseText}
            </div>
          )}
        </div>
      </div>
    </BaseCard>
  );
};
