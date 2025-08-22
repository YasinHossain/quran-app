'use client';

import React, { useState } from 'react';
import { EllipsisHIcon } from './icons';
import VerseActionsBottomSheet from './VerseActionsBottomSheet';

interface VerseActionsMobileProps {
  verseKey: string;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isBookmarked: boolean;
  onPlayPause: () => void;
  onBookmark: () => void;
  onShare?: () => void;
  className?: string;
}

const VerseActionsMobile: React.FC<VerseActionsMobileProps> = ({
  verseKey,
  isPlaying,
  isLoadingAudio,
  isBookmarked,
  onPlayPause,
  onBookmark,
  onShare,
  className = '',
}) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleMenuClick = () => {
    setIsBottomSheetOpen(true);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  return (
    <>
      <div className={`flex items-center justify-between ${className}`}>
        {/* Verse number on the left */}
        <div className="flex-shrink-0">
          <span className="font-semibold text-accent text-sm">{verseKey}</span>
        </div>

        {/* Three-dot menu on the right */}
        <button
          onClick={handleMenuClick}
          className="p-1 rounded-full hover:bg-interactive transition-colors touch-manipulation"
          aria-label="Open verse actions menu"
        >
          <EllipsisHIcon size={18} className="text-muted" />
        </button>
      </div>

      {/* Bottom Sheet */}
      <VerseActionsBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={handleCloseBottomSheet}
        verseKey={verseKey}
        isPlaying={isPlaying}
        isLoadingAudio={isLoadingAudio}
        isBookmarked={isBookmarked}
        onPlayPause={onPlayPause}
        onBookmark={onBookmark}
        onShare={onShare}
      />
    </>
  );
};

export default VerseActionsMobile;
