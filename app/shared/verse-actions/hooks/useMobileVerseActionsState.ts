'use client';

import { useState, useCallback } from 'react';

import { defaultShare } from '../utils';

interface UseMobileVerseActionsStateParams {
  onShare?: () => void | Promise<void>;
  onBookmark?: () => void;
  showRemove?: boolean;
}

export function useMobileVerseActionsState({
  onShare,
  onBookmark,
  showRemove = false,
}: UseMobileVerseActionsStateParams) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);

  const openBottomSheet = useCallback(() => setIsBottomSheetOpen(true), []);
  const closeBottomSheet = useCallback(() => setIsBottomSheetOpen(false), []);
  const openBookmarkModal = useCallback(() => setIsBookmarkModalOpen(true), []);
  const closeBookmarkModal = useCallback(() => setIsBookmarkModalOpen(false), []);

  const handleBookmarkClick = useCallback(() => {
    if (showRemove && onBookmark) {
      onBookmark();
    } else {
      openBookmarkModal();
    }
  }, [showRemove, onBookmark, openBookmarkModal]);

  const handleShare = onShare || defaultShare;

  return {
    isBottomSheetOpen,
    openBottomSheet,
    closeBottomSheet,
    isBookmarkModalOpen,
    openBookmarkModal,
    closeBookmarkModal,
    handleBookmarkClick,
    handleShare,
  } as const;
}

