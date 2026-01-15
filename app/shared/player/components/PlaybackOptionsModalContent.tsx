import React, { memo } from 'react';

import { UnifiedModal } from '@/app/shared/components/modal/UnifiedModal';

import { ModalFooter } from './ModalFooter';
import { ModalHeader } from './ModalHeader';
import { ReciterPanel } from './ReciterPanel';
import { RepeatPanel } from './RepeatPanel';
import { Tabs } from './Tabs';

import type { RepeatOptions } from '@/app/shared/player/types';

interface ContentProps {
  open: boolean;
  onClose: () => void;
  activeTab: 'reciter' | 'repeat';
  setActiveTab: (tab: 'reciter' | 'repeat') => void;
  localReciter: number;
  setLocalReciter: (id: number) => void;
  localRepeat: RepeatOptions;
  setLocalRepeat: React.Dispatch<React.SetStateAction<RepeatOptions>>;
  rangeWarning: string | null;
  setRangeWarning: React.Dispatch<React.SetStateAction<string | null>>;
  commit: () => void;
}

export const PlaybackOptionsModalContent = memo(function PlaybackOptionsModalContent({
  open,
  onClose,
  activeTab,
  setActiveTab,
  localReciter,
  setLocalReciter,
  localRepeat,
  setLocalRepeat,
  rangeWarning,
  setRangeWarning,
  commit,
}: ContentProps) {
  return (
    <UnifiedModal
      isOpen={open}
      onClose={onClose}
      ariaLabel="Playback options"
      layerClassName="z-[120]"
      backdropClassName="touch-none"
      contentClassName="max-w-3xl mx-auto max-h-[85vh] overflow-hidden flex flex-col"
    >
      <div className="flex-shrink-0 px-4 pt-4 md:px-6 md:pt-6">
        <ModalHeader onClose={onClose} />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-4 pb-1">
          {activeTab === 'reciter' && (
            <ReciterPanel localReciter={localReciter} setLocalReciter={setLocalReciter} />
          )}
          {activeTab === 'repeat' && (
            <RepeatPanel
              localRepeat={localRepeat}
              setLocalRepeat={setLocalRepeat}
              rangeWarning={rangeWarning}
              setRangeWarning={setRangeWarning}
            />
          )}
        </div>
      </div>

      <div className="flex-shrink-0 px-4 pb-4 md:px-6 md:pb-6">
        <ModalFooter onClose={onClose} onApply={commit} />
      </div>
    </UnifiedModal>
  );
});
