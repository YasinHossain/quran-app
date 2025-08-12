import React, { useEffect, useState } from 'react';
import { SlidersHorizontal, Mic2, Repeat } from 'lucide-react';
import { useAudio } from '@/app/(features)/player/context/AudioContext';
import { RECITERS } from '@/lib/audio/reciters';
import type { RepeatOptions } from '@/app/(features)/player/types';

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
  const { reciter, setReciter, repeatOptions, setRepeatOptions } = useAudio();
  const [localReciter, setLocalReciter] = useState(reciter.id.toString());
  const [localRepeat, setLocalRepeat] = useState<RepeatOptions>(repeatOptions);
  const [rangeWarning, setRangeWarning] = useState<string | null>(null);

  useEffect(() => {
    setLocalReciter(reciter.id.toString());
  }, [reciter]);

  useEffect(() => {
    setLocalRepeat(repeatOptions);
  }, [repeatOptions]);

  useEffect(() => {
    if (!open) setRangeWarning(null);
  }, [open]);

  const commitOptions = () => {
    const numericKeys: (keyof RepeatOptions)[] = [
      'start',
      'end',
      'playCount',
      'repeatEach',
      'delay',
    ];
    if (
      numericKeys.some((key) => {
        const val = localRepeat[key];
        return val !== undefined && !Number.isInteger(val);
      })
    ) {
      setRangeWarning('Please enter whole numbers only.');
      return;
    }
    const newReciter = RECITERS.find((r) => r.id.toString() === localReciter);
    if (newReciter) setReciter(newReciter);
    const start = Math.max(1, localRepeat.start ?? 1);
    const end = Math.max(start, localRepeat.end ?? start);
    if (start !== localRepeat.start || end !== localRepeat.end) {
      setRangeWarning('Start and end values adjusted to a valid range.');
      setLocalRepeat({ ...localRepeat, start, end });
      return;
    }
    setRangeWarning(null);
    setRepeatOptions({ ...localRepeat, start, end });
    onClose();
  };
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
          {/* Reciter list */}
          {activeTab === 'reciter' && (
            <div className="md:col-span-2">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-auto pr-1">
                {RECITERS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setLocalReciter(r.id.toString())}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition ${
                      localReciter === r.id.toString()
                        ? theme === 'dark'
                          ? 'border-sky-500 bg-sky-500/10'
                          : 'border-[#0E2A47] bg-[#0E2A47]/5'
                        : theme === 'dark'
                          ? 'border-slate-700 hover:bg-slate-700/50'
                          : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0">
                      <div
                        className={`text-sm font-medium truncate ${
                          theme === 'dark' ? 'text-slate-200' : ''
                        }`}
                      >
                        {r.name}
                      </div>
                      {r.locale && (
                        <div
                          className={`text-xs ${
                            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          {r.locale}
                        </div>
                      )}
                    </div>
                    <div
                      className={`h-4 w-4 rounded-full ${
                        localReciter === r.id.toString()
                          ? theme === 'dark'
                            ? 'bg-sky-500'
                            : 'bg-[#0E2A47]'
                          : theme === 'dark'
                            ? 'border-slate-600'
                            : 'border-slate-300'
                      } border`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Repeat panel */}
          {activeTab === 'repeat' && (
            <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
              <div
                className={`rounded-xl border p-4 ${
                  theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                }`}
              >
                <div className={`font-medium mb-3 ${theme === 'dark' ? 'text-slate-200' : ''}`}>
                  Mode
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['off', 'single', 'range', 'surah'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setLocalRepeat({ ...localRepeat, mode: m })}
                      className={`px-3 py-2 rounded-xl text-sm capitalize ${
                        localRepeat.mode === m
                          ? theme === 'dark'
                            ? 'bg-sky-500 text-white'
                            : 'bg-[#0E2A47] text-white'
                          : theme === 'dark'
                            ? 'bg-slate-700 hover:bg-slate-600'
                            : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div
                className={`rounded-xl border p-4 grid grid-cols-2 gap-3 ${
                  theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                }`}
              >
                {rangeWarning && (
                  <div
                    className={`col-span-2 text-sm ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`}
                  >
                    {rangeWarning}
                  </div>
                )}
                <NumberField
                  label="Start"
                  value={localRepeat.start ?? 1}
                  min={1}
                  onChange={(v) => {
                    setLocalRepeat({ ...localRepeat, start: v });
                    setRangeWarning(null);
                  }}
                  theme={theme}
                />
                <NumberField
                  label="End"
                  value={localRepeat.end ?? localRepeat.start ?? 1}
                  min={1}
                  onChange={(v) => {
                    setLocalRepeat({ ...localRepeat, end: v });
                    setRangeWarning(null);
                  }}
                  theme={theme}
                />
                <NumberField
                  label="Play count"
                  value={localRepeat.playCount ?? 1}
                  min={1}
                  onChange={(v) => setLocalRepeat({ ...localRepeat, playCount: v })}
                  theme={theme}
                />
                <NumberField
                  label="Repeat each"
                  value={localRepeat.repeatEach ?? 1}
                  min={1}
                  onChange={(v) => setLocalRepeat({ ...localRepeat, repeatEach: v })}
                  theme={theme}
                />
                <div className="col-span-2">
                  <NumberField
                    label="Delay (s)"
                    value={localRepeat.delay ?? 0}
                    min={0}
                    onChange={(v) => setLocalRepeat({ ...localRepeat, delay: v })}
                    theme={theme}
                  />
                </div>
              </div>
            </div>
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
              onClick={commitOptions}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  theme,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  theme: 'light' | 'dark';
}) {
  return (
    <label className="text-sm">
      <span className={`block mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
        {label}
      </span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        step={1}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          onChange(Number.isNaN(v) ? (min ?? value) : v);
        }}
        className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 ${
          theme === 'dark'
            ? 'border-slate-700 bg-slate-700 focus:ring-sky-500/35'
            : 'border-slate-300 bg-white focus:ring-[#0E2A47]/35'
        }`}
      />
    </label>
  );
}
