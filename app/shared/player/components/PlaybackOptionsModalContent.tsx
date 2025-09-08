import React, { memo } from 'react';
import { createPortal } from 'react-dom';

import { ModalFooter } from './ModalFooter';
import { ModalHeader } from './ModalHeader';
import { ReciterPanel } from './ReciterPanel';
import { RepeatPanel } from './RepeatPanel';
import { Tabs } from './Tabs';

import type { RepeatOptions } from '@/app/shared/player/types';

interface ContentProps {
  onClose: () => void;
  activeTab: 'reciter' | 'repeat';
  setActiveTab: (tab: 'reciter' | 'repeat') => void;
  localReciter: string;
  setLocalReciter: (id: string) => void;
  localRepeat: RepeatOptions;
  setLocalRepeat: (opts: RepeatOptions) => void;
  rangeWarning: string | null;
  setRangeWarning: (msg: string | null) => void;
  commit: () => void;
}

const ModalContainer = memo(function ModalContainer({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return createPortal(
    <div
      className="fixed inset-0 z-[120] grid place-items-center bg-surface-overlay/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) onClose();
      }}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>,
    document.body
  );
});

export const PlaybackOptionsModalContent = memo(function PlaybackOptionsModalContent({
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
    <ModalContainer onClose={onClose}>
      <div
        className="w-full max-w-3xl rounded-2xl border border-border bg-surface p-4 md:p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <ModalHeader onClose={onClose} />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="grid md:grid-cols-2 gap-4">
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

        <ModalFooter onClose={onClose} onApply={commit} />
      </div>
    </ModalContainer>
  );
});
