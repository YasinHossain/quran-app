import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SlidersHorizontal, Mic2, Repeat } from 'lucide-react';
import ReciterPanel from './ReciterPanel';
import RepeatPanel from './RepeatPanel';
import usePlaybackOptions from '../hooks/usePlaybackOptions';

interface Props {
  open: boolean;
  onClose: () => void;
  activeTab: 'reciter' | 'repeat';
  setActiveTab: (tab: 'reciter' | 'repeat') => void;
}

export default function PlaybackOptionsModal({ open, onClose, activeTab, setActiveTab }: Props) {
  const {
    localReciter,
    setLocalReciter,
    localRepeat,
    setLocalRepeat,
    rangeWarning,
    setRangeWarning,
    commit,
  } = usePlaybackOptions(onClose);

  useEffect(() => {
    if (!open) setRangeWarning(null);
  }, [open, setRangeWarning]);

  if (!open) return null;

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
      <div
        className="w-full max-w-3xl rounded-2xl border border-border bg-surface p-4 md:p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl grid place-items-center bg-accent/10 text-accent">
            <SlidersHorizontal />
          </div>
          <div className="font-semibold text-foreground">Playback Options</div>
          <button className="ml-auto text-muted hover:text-foreground" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tabs */}
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
              <Mic2 className="h-4 w-4" />
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
              <Repeat className="h-4 w-4" />
              Verse Repeat
            </span>
          </button>
        </div>

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
              onClick={commit}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
