'use client';

import { useState, useCallback } from 'react';

import { defaultShare } from '@/app/shared/verse-actions/utils';

interface UseMobileVerseActionsStateParams {
  onShare?: () => void | Promise<void>;
  onBookmark?: () => void;
  showRemove?: boolean;
  onAddToPlan?: () => void;
}

interface MobileVerseActionsState {
  isBottomSheetOpen: boolean;
  openBottomSheet: () => void;
  closeBottomSheet: () => void;
  isBookmarkModalOpen: boolean;
  openBookmarkModal: () => void;
  closeBookmarkModal: () => void;
  handleBookmarkClick: () => void;
  handleShare: () => void;
  handleAddToPlan: () => void;
}
export function useMobileVerseActionsState({
  onShare,
  onBookmark,
  showRemove = false,
  onAddToPlan,
}: UseMobileVerseActionsStateParams): MobileVerseActionsState {
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
  const handleAddToPlan = useCallback(() => {
    if (onAddToPlan) onAddToPlan();
  }, [onAddToPlan]);

  return {
    isBottomSheetOpen,
    openBottomSheet,
    closeBottomSheet,
    isBookmarkModalOpen,
    openBookmarkModal,
    closeBookmarkModal,
    handleBookmarkClick,
    handleShare,
    handleAddToPlan,
  };
}
