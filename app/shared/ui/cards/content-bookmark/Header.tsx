import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { ResponsiveVerseActions } from '@/app/shared/ResponsiveVerseActions';
import { formatTimeAgo } from '@/app/shared/utils/time';
import { localizeDigits } from '@/lib/text/localizeNumbers';
import { parseVerseKey } from '@/lib/utils/verse';

interface HeaderProps {
  verseKey?: string;
  surahName?: string;
  createdAt: number;
  isPlaying?: boolean;
  isLoadingAudio?: boolean;
  isBookmarked?: boolean;
  onPlayPause?: () => void;
  onBookmark?: () => void;
  onNavigateToVerse?: () => void;
}

export const Header = memo(function Header({
  verseKey,
  surahName,
  createdAt,
  isPlaying = false,
  isLoadingAudio = false,
  isBookmarked = true,
  onPlayPause,
  onBookmark,
  onNavigateToVerse,
}: HeaderProps) {
  const { t, i18n } = useTranslation();
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
    }
  }, []);

  const { surahNumber } = verseKey ? parseVerseKey(verseKey) : { surahNumber: undefined };
  const resolvedSurahName =
    typeof surahNumber === 'number'
      ? t(`surah_names.${surahNumber}`, surahName ?? '')
      : (surahName ?? '');
  const verseKeyLabel = verseKey ? localizeDigits(verseKey, i18n.language) : '';

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 mt-1 min-w-0">
        <span className="text-accent font-semibold text-[1.08rem] leading-[1.1]">
          {verseKeyLabel}
        </span>
        <span className="text-muted text-base leading-[1.1] font-medium truncate -mt-px">
          {resolvedSurahName}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs text-muted">{formatTimeAgo(createdAt, i18n.language)}</span>
        <div
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
        >
          <ResponsiveVerseActions
            verseKey={verseKey!}
            isPlaying={isPlaying}
            isLoadingAudio={isLoadingAudio}
            isBookmarked={isBookmarked}
            onPlayPause={onPlayPause || (() => {})}
            onBookmark={onBookmark}
            onNavigateToVerse={onNavigateToVerse}
            showRemove
            className="scale-90"
          />
        </div>
      </div>
    </div>
  );
});
