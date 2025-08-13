import React, { useEffect } from 'react';
import { SlidersHorizontal, Mic2, Repeat } from 'lucide-react';
import ReciterPanel from './ReciterPanel';
import RepeatPanel from './RepeatPanel';
import usePlaybackOptions from '../hooks/usePlaybackOptions';

interface Props {
  open: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  activeTab: 'reciter' | 'repeat';
  setActiveTab: (tab: 'reciter' | 'repeat') => void;
}

export default function PlaybackOptionsModal({
  open,
  onClose,
  theme,
  activeTab,
  setActiveTab,
}: Props) {
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

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
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
        className={`w-full max-w-3xl rounded-2xl border p-4 md:p-6 ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700 shadow-2xl'
            : 'bg-white border-transparent shadow-[0_10px_30px_rgba(2,6,23,0.12),0_1px_2px_rgba(2,6,23,0.06)]'
        }`}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div
            className={`h-10 w-10 rounded-xl grid place-items-center ${
              theme === 'dark' ? 'bg-sky-500/10 text-sky-500' : 'bg-[#0E2A47]/10 text-[#0E2A47]'
            }`}
          >
            <SlidersHorizontal />
          </div>
          <div className={`font-semibold ${theme === 'dark' ? 'text-slate-200' : ''}`}>
            Playback Options
          </div>
          <button
            className={`ml-auto ${
              theme === 'dark'
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex justify-center gap-2">
          <button
            onClick={() => setActiveTab('reciter')}
            className={`px-3 py-1.5 rounded-full text-sm ${
              activeTab === 'reciter'
                ? theme === 'dark'
                  ? 'bg-sky-500/10 text-sky-400'
                  : 'bg-[#0E2A47]/10 text-[#0E2A47]'
                : theme === 'dark'
                  ? 'hover:bg-white/10'
                  : 'hover:bg-slate-900/5'
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
                ? theme === 'dark'
                  ? 'bg-sky-500/10 text-sky-400'
                  : 'bg-[#0E2A47]/10 text-[#0E2A47]'
                : theme === 'dark'
                  ? 'hover:bg-white/10'
                  : 'hover:bg-slate-900/5'
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
            <ReciterPanel
              theme={theme}
              localReciter={localReciter}
              setLocalReciter={setLocalReciter}
            />
          )}
          {activeTab === 'repeat' && (
            <RepeatPanel
              theme={theme}
              localRepeat={localRepeat}
              setLocalRepeat={setLocalRepeat}
              rangeWarning={rangeWarning}
              setRangeWarning={setRangeWarning}
            />
          )}
        </div>

        <div className="mt-5 flex items-center justify-between text-sm">
          <div className={`text-slate-500 ${theme === 'dark' ? 'text-slate-400' : ''}`}>
            Tips: Space • ←/→ seek • ↑/↓ volume
          </div>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-xl ${
                theme === 'dark'
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 rounded-xl text-white hover:opacity-90 ${
                theme === 'dark' ? 'bg-sky-500' : 'bg-[#0E2A47]'
              }`}
              onClick={commit}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
