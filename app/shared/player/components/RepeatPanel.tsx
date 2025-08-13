import React from 'react';
import type { RepeatOptions } from '../types';

interface Props {
  theme: 'light' | 'dark';
  localRepeat: RepeatOptions;
  setLocalRepeat: React.Dispatch<React.SetStateAction<RepeatOptions>>;
  rangeWarning: string | null;
  setRangeWarning: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function RepeatPanel({
  theme,
  localRepeat,
  setLocalRepeat,
  rangeWarning,
  setRangeWarning,
}: Props) {
  return (
    <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
      <div
        className={`rounded-xl border p-4 ${
          theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
        }`}
      >
        <div className={`font-medium mb-3 ${theme === 'dark' ? 'text-slate-200' : ''}`}>Mode</div>
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
            className={`col-span-2 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}
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
