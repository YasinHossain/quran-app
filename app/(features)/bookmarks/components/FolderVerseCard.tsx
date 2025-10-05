'use client';

import { cn } from '@/lib/utils/cn';
import { handleKeyboardActivation } from '@/lib/utils/keyboard';
import { parseVerseKey } from '@/lib/utils/verse';

import type { Bookmark } from '@/types/bookmark';

interface FolderVerseCardProps {
  bookmark: Bookmark;
  onClick?: () => void;
  className?: string;
}

export const FolderVerseCard = ({
  bookmark,
  onClick,
  className,
}: FolderVerseCardProps): React.JSX.Element => {
  const { surahNumber, ayahNumber } = parseVerseKey(bookmark.verseKey);

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => handleKeyboardActivation(e, onClick)}
      role="button"
      tabIndex={0}
      className={cn(
        'group min-h-0 cursor-pointer rounded-lg border p-2.5 transition-all duration-200',
        'bg-surface/60 border-border/60 hover:border-accent/30 hover:bg-surface-hover hover:shadow-sm',
        className
      )}
    >
      <div className="flex items-start space-x-2.5">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-accent/10 text-xs font-semibold text-accent group-hover:bg-accent/15">
          {ayahNumber}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold text-foreground">
            {bookmark.surahName || `Surah ${surahNumber}`}
          </div>
          <div className="text-xs leading-tight text-muted/80">
            {bookmark.verseKey || `${surahNumber}:${ayahNumber}`}
          </div>
          {(bookmark.translation || bookmark.verseText) && (
            <div className="mt-1 line-clamp-1 text-xs leading-tight text-muted-foreground">
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
    </div>
  );
};
