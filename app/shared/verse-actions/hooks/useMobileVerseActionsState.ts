import { useCallback, useState } from 'react';

import { defaultShare } from '../utils';

interface UseMobileVerseActionsStateParams {
  onShare?: () => void;
  onBookmark?: () => void;
  showRemove?: boolean;
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
}

export function useMobileVerseActionsState({
  onShare,
  onBookmark,
  showRemove = false,
}: UseMobileVerseActionsStateParams): MobileVerseActionsState {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);

  const openBottomSheet = useCallback(() => setIsBottomSheetOpen(true), []);
  const closeBottomSheet = useCallback(() => setIsBottomSheetOpen(false), []);

  const openBookmarkModal = useCallback(() => setIsBookmarkModalOpen(true), []);
  const closeBookmarkModal = useCallback(() => setIsBookmarkModalOpen(false), []);

  const handleShare = onShare || defaultShare;

  const handleBookmarkClick = useCallback(() => {
    if (showRemove && onBookmark) {
      onBookmark();
    } else {
      openBookmarkModal();
    }
  }, [showRemove, onBookmark, openBookmarkModal]);

  return {
    isBottomSheetOpen,
    openBottomSheet,
    closeBottomSheet,
    isBookmarkModalOpen,
    openBookmarkModal,
    closeBookmarkModal,
    handleBookmarkClick,
    handleShare,
  };
}

