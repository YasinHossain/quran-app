import React, { memo, useCallback } from 'react';

import { ResponsiveVerseActions } from '@/app/shared/ResponsiveVerseActions';
import { formatTimeAgo } from '@/app/shared/utils/time';

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
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
    }
  }, []);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-1 mt-1">
        <span className="text-accent font-semibold text-sm">{verseKey}</span>
        <span className="text-muted text-sm truncate">{surahName}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs text-muted">{formatTimeAgo(createdAt)}</span>
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
