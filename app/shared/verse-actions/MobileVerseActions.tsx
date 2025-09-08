'use client';

import { useState } from 'react';

import { BookmarkModal } from '@/app/shared/components/BookmarkModal';
import { EllipsisHIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

import { MobileBottomSheet } from './MobileBottomSheet';
import { VerseActionsProps } from './types';
import { defaultShare } from './utils';

export const MobileVerseActions = ({
  verseKey,
  verseId,
  isPlaying,
  isLoadingAudio,
  isBookmarked,
  onPlayPause,
  onBookmark,
  onShare,
  onNavigateToVerse,
  showRemove = false,
  className = '',
}: VerseActionsProps): React.JSX.Element => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const handleShare = onShare || defaultShare;

  const handleBookmarkClick = (): void => {
    if (showRemove && onBookmark) {
      onBookmark();
    } else {
      setIsBookmarkModalOpen(true);
    }
  };

  return (
    <>
      <div className={cn('flex items-center justify-between', className)}>
        {/* Verse number on the left */}
        <div className="flex-shrink-0">
          <span className="font-semibold text-accent text-sm">{verseKey}</span>
        </div>

        {/* Three-dot menu on the right */}
        <button
          onClick={() => setIsBottomSheetOpen(true)}
          className={cn(
            'p-1 rounded-full hover:bg-interactive transition-colors',
            touchClasses.target,
            touchClasses.gesture,
            touchClasses.focus
          )}
          aria-label="Open verse actions menu"
        >
          <EllipsisHIcon size={18} className="text-muted" />
        </button>
      </div>

      {/* Bottom Sheet */}
      <MobileBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        verseKey={verseKey}
        isPlaying={isPlaying}
        isLoadingAudio={isLoadingAudio}
        isBookmarked={isBookmarked}
        onPlayPause={onPlayPause}
        onBookmark={handleBookmarkClick}
        onShare={handleShare}
        onNavigateToVerse={onNavigateToVerse}
        showRemove={showRemove}
      />

      {/* BookmarkModal */}
      <BookmarkModal
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
        verseId={verseId || verseKey}
        verseKey={verseKey}
      />
    </>
  );
};
