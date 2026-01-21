'use client';

import { memo, useEffect, useState } from 'react';

import { Portal } from '@/app/shared/components/Portal';

import { BottomSheetBackdrop } from './BottomSheetBackdrop';
import { BottomSheetContent } from './BottomSheetContent';
import { useVerseActions } from './hooks/useVerseActions';

// Duration for exit animation (matches CSS)
const EXIT_ANIMATION_MS = 150;

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
  onAddToPlan: () => void;
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
  onAddToPlan,
  onNavigateToVerse,
  showRemove = false,
}: MobileBottomSheetProps): React.JSX.Element | null {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isExiting, setIsExiting] = useState(false);

  const actions = useVerseActions({
    isPlaying,
    isLoadingAudio,
    isBookmarked,
    showRemove,
    verseKey,
    onPlayPause,
    onBookmark,
    onShare,
    onAddToPlan,
    ...(onNavigateToVerse ? { onNavigateToVerse } : {}),
    onClose,
  });

  // Handle open/close state changes
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsExiting(false);
      return undefined;
    }
    if (shouldRender) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsExiting(false);
      }, EXIT_ANIMATION_MS);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  return (
    <Portal>
      <BottomSheetBackdrop onClick={onClose} isExiting={isExiting} />
      <BottomSheetContent
        verseKey={verseKey}
        actions={actions}
        onClose={onClose}
        isExiting={isExiting}
      />
    </Portal>
  );
});
