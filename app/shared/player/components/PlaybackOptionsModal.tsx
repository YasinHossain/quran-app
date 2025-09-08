import React, { memo } from 'react';

import { PlaybackOptionsModalContent } from './PlaybackOptionsModalContent';
import { usePlaybackOptionsModal } from '../hooks/usePlaybackOptionsModal';

interface Props {
  open: boolean;
  onClose: () => void;
  activeTab: 'reciter' | 'repeat';
  setActiveTab: (tab: 'reciter' | 'repeat') => void;
}

export const PlaybackOptionsModal = memo(function PlaybackOptionsModal({
  open,
  onClose,
  activeTab,
  setActiveTab,
}: Props) {
  const modalState = usePlaybackOptionsModal(open, onClose);

  if (!open) return null;

  return (
    <PlaybackOptionsModalContent
      onClose={onClose}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      {...modalState}
    />
  );
});
