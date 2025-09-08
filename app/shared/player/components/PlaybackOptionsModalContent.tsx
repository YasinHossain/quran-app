import React, { memo } from 'react';
import { createPortal } from 'react-dom';

import { SlidersIcon, MicIcon, RepeatIcon } from '@/app/shared/icons';

import { ReciterPanel } from './ReciterPanel';
import { RepeatPanel } from './RepeatPanel';

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

const ModalHeader = memo(function ModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="h-10 w-10 rounded-xl grid place-items-center bg-accent/10 text-accent">
        <SlidersIcon />
      </div>
      <div className="font-semibold text-foreground">Playback Options</div>
      <button className="ml-auto text-muted hover:text-foreground" onClick={onClose}>
        ✕
      </button>
    </div>
  );
});

const Tabs = memo(function Tabs({
  activeTab,
  setActiveTab,
}: Pick<ContentProps, 'activeTab' | 'setActiveTab'>) {
  return (
    <div className="mb-4 flex justify-center gap-2">
      <button
        onClick={() => setActiveTab('reciter')}
        className={`px-3 py-1.5 rounded-full text-sm ${
          activeTab === 'reciter'
            ? 'bg-accent/10 text-accent'
            : 'bg-surface hover:bg-interactive-hover'
        }`}
      >
        <span className="inline-flex items-center gap-2">
          <MicIcon className="h-4 w-4" />
          Reciter
        </span>
      </button>
      <button
        onClick={() => setActiveTab('repeat')}
        className={`px-3 py-1.5 rounded-full text-sm ${
          activeTab === 'repeat'
            ? 'bg-accent/10 text-accent'
            : 'bg-surface hover:bg-interactive-hover'
        }`}
      >
        <span className="inline-flex items-center gap-2">
          <RepeatIcon className="h-4 w-4" />
          Verse Repeat
        </span>
      </button>
    </div>
  );
});

const ModalFooter = memo(function ModalFooter({
  onClose,
  onApply,
}: {
  onClose: () => void;
  onApply: () => void;
}) {
  return (
    <div className="mt-5 flex items-center justify-between text-sm">
      <div className="text-muted">Tips: Space • ←/→ seek • ↑/↓ volume</div>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded-xl bg-surface hover:bg-interactive-hover text-foreground"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded-xl bg-accent text-on-accent hover:opacity-90"
          onClick={onApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
});

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
