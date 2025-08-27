'use client';

import React, { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import BookmarkModal from '../components/BookmarkModal';
import MobileBottomSheet from './MobileBottomSheet';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils';
import { VerseActionsProps } from './types';
import { defaultShare } from './utils';

const MobileVerseActions: React.FC<VerseActionsProps> = ({
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
}) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const handleShare = onShare || defaultShare;

  const handleBookmarkClick = () => {
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
          <MoreHorizontal size={18} className="text-muted" />
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

export default MobileVerseActions;
