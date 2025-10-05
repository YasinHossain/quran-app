'use client';

import { AnimatePresence } from 'framer-motion';
import { memo } from 'react';

import { BottomSheetBackdrop } from './BottomSheetBackdrop';
import { BottomSheetContent } from './BottomSheetContent';
import { useVerseActions } from './hooks/useVerseActions';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  verseKey: string;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isBookmarked: boolean;
  onPlayPause: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onNavigateToVerse?: () => void;
  showRemove?: boolean;
}

export const MobileBottomSheet = memo(function MobileBottomSheet({
  isOpen,
  onClose,
  verseKey,
  isPlaying,
  isLoadingAudio,
  isBookmarked,
  onPlayPause,
  onBookmark,
  onShare,
  onNavigateToVerse,
  showRemove = false,
}: MobileBottomSheetProps): React.JSX.Element {
  const actions = useVerseActions({
    isPlaying,
    isLoadingAudio,
    isBookmarked,
    showRemove,
    verseKey,
    onPlayPause,
    onBookmark,
    onShare,
    ...(onNavigateToVerse ? { onNavigateToVerse } : {}),
    onClose,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <BottomSheetBackdrop onClick={onClose} />
          <BottomSheetContent verseKey={verseKey} actions={actions} onClose={onClose} />
        </>
      )}
    </AnimatePresence>
  );
});
