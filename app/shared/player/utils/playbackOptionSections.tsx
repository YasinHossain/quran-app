import React from 'react';

import { SlidersIcon, MicIcon, RepeatIcon } from '@/app/shared/icons';

export function ModalHeader({ onClose }: { onClose: () => void }): React.JSX.Element {
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
}

export function Tabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: 'reciter' | 'repeat';
  setActiveTab: (tab: 'reciter' | 'repeat') => void;
}): React.JSX.Element {
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
}

export function ModalFooter({
  onClose,
  onApply,
}: {
  onClose: () => void;
  onApply: () => void;
}): React.JSX.Element {
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
}
