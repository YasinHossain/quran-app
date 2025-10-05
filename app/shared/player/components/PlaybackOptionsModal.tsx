import React, { memo } from 'react';

import { usePlaybackOptionsModal } from '@/app/shared/player/hooks/usePlaybackOptionsModal';

import { PlaybackOptionsModalContent } from './PlaybackOptionsModalContent';

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
