import React from 'react';
import type { RepeatOptions } from '../types';

interface Props {
  localRepeat: RepeatOptions;
  setLocalRepeat: React.Dispatch<React.SetStateAction<RepeatOptions>>;
  rangeWarning: string | null;
  setRangeWarning: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function RepeatPanel({
  localRepeat,
  setLocalRepeat,
  rangeWarning,
  setRangeWarning,
}: Props) {
  return (
    <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
      <div className="rounded-xl border border-border p-4">
        <div className="font-medium mb-3 text-foreground">Mode</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['off', 'single', 'range', 'surah'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setLocalRepeat({ ...localRepeat, mode: m })}
              className={`px-3 py-2 rounded-xl text-sm capitalize ${
                localRepeat.mode === m
                  ? 'bg-accent text-white'
                  : 'bg-interactive hover:bg-interactive'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-border p-4 grid grid-cols-2 gap-3">
        {rangeWarning && <div className="col-span-2 text-sm text-red-400">{rangeWarning}</div>}
        <NumberField
          label="Start"
          value={localRepeat.start ?? 1}
          min={1}
          onChange={(v) => {
            setLocalRepeat({ ...localRepeat, start: v });
            setRangeWarning(null);
          }}
        />
        <NumberField
          label="End"
          value={localRepeat.end ?? localRepeat.start ?? 1}
          min={1}
          onChange={(v) => {
            setLocalRepeat({ ...localRepeat, end: v });
            setRangeWarning(null);
          }}
        />
        <NumberField
          label="Play count"
          value={localRepeat.playCount ?? 1}
          min={1}
          onChange={(v) => setLocalRepeat({ ...localRepeat, playCount: v })}
        />
        <NumberField
          label="Repeat each"
          value={localRepeat.repeatEach ?? 1}
          min={1}
          onChange={(v) => setLocalRepeat({ ...localRepeat, repeatEach: v })}
        />
        <div className="col-span-2">
          <NumberField
            label="Delay (s)"
            value={localRepeat.delay ?? 0}
            min={0}
            onChange={(v) => setLocalRepeat({ ...localRepeat, delay: v })}
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
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <label className="text-sm">
      <span className="block mb-1 text-muted">{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        step={1}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          onChange(Number.isNaN(v) ? (min ?? value) : v);
        }}
        className="w-full rounded-xl border border-border bg-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/35"
      />
    </label>
  );
}
