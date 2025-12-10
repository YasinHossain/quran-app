'use client';

import React, { useEffect, useMemo, useCallback } from 'react';

import { SurahVerseSelector } from '@/app/shared/components/SurahVerseSelector';
import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';
import type { RepeatOptions } from '@/app/shared/player/types';

interface Props {
  localRepeat: RepeatOptions;
  setLocalRepeat: React.Dispatch<React.SetStateAction<RepeatOptions>>;
  rangeWarning: string | null;
  setRangeWarning: React.Dispatch<React.SetStateAction<string | null>>;
}

export function RepeatPanel({
  localRepeat,
  setLocalRepeat,
  rangeWarning,
  setRangeWarning,
}: Props): React.JSX.Element {
  useEffect(() => {
    setRangeWarning(null);
  }, [localRepeat.mode, setRangeWarning]);

  return (
    <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
      <ModeSelector localRepeat={localRepeat} setLocalRepeat={setLocalRepeat} />
      <RepeatFields
        localRepeat={localRepeat}
        setLocalRepeat={setLocalRepeat}
        rangeWarning={rangeWarning}
        setRangeWarning={setRangeWarning}
      />
    </div>
  );
}

function ModeSelector({
  localRepeat,
  setLocalRepeat,
}: {
  localRepeat: RepeatOptions;
  setLocalRepeat: React.Dispatch<React.SetStateAction<RepeatOptions>>;
}): React.JSX.Element {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="font-semibold mb-3 text-foreground">Mode</div>
      <div className="flex items-center p-1.5 rounded-full bg-interactive border border-border">
        {(['off', 'single', 'range', 'surah'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setLocalRepeat({ ...localRepeat, mode: m })}
            className={`flex-1 px-3 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${localRepeat.mode === m
              ? 'bg-surface shadow text-foreground'
              : 'text-muted hover:text-foreground hover:bg-surface/30'
              }`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

function RepeatFields({
  localRepeat,
  setLocalRepeat,
  rangeWarning,
  setRangeWarning,
}: Props): React.JSX.Element {
  const isSingle = localRepeat.mode === 'single';

  return (
    <div className="rounded-xl border border-border p-4 grid grid-cols-2 gap-3">
      {rangeWarning && <div className="col-span-2 text-sm text-status-warning">{rangeWarning}</div>}
      {isSingle ? (
        <SingleVerseFields
          localRepeat={localRepeat}
          setLocalRepeat={setLocalRepeat}
          setRangeWarning={setRangeWarning}
        />
      ) : (
        <>
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
        </>
      )}
      {!isSingle && (
        <NumberField
          label="Play count"
          value={localRepeat.playCount ?? 1}
          min={1}
          onChange={(v) => setLocalRepeat({ ...localRepeat, playCount: v })}
        />
      )}
      <NumberField
        label="Repeat each"
        value={localRepeat.repeatEach ?? 1}
        min={1}
        onChange={(v) => setLocalRepeat({ ...localRepeat, repeatEach: v })}
        className={isSingle ? 'col-span-2' : undefined}
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
  );
}

function SingleVerseFields({
  localRepeat,
  setLocalRepeat,
  setRangeWarning,
}: {
  localRepeat: RepeatOptions;
  setLocalRepeat: React.Dispatch<React.SetStateAction<RepeatOptions>>;
  setRangeWarning: React.Dispatch<React.SetStateAction<string | null>>;
}): React.JSX.Element {
  const { chapters, isLoading } = useSurahNavigationData();

  // Validate verse number if loaded
  const selectedSurah = useMemo(
    () => chapters.find((chapter) => chapter.id === localRepeat.surahId),
    [chapters, localRepeat.surahId]
  );

  useEffect(() => {
    if (!selectedSurah?.verses_count || !localRepeat.verseNumber) return;
    if (localRepeat.verseNumber > selectedSurah.verses_count) {
      setLocalRepeat((prev) => ({ ...prev, verseNumber: selectedSurah.verses_count }));
    }
  }, [localRepeat.verseNumber, selectedSurah, setLocalRepeat]);

  const handleSurahChange = useCallback((id: number | undefined) => {
    setLocalRepeat((prev) => ({
      ...prev,
      surahId: id,
      verseNumber: undefined,
    } as unknown as RepeatOptions));
    setRangeWarning(null);
  }, [setLocalRepeat, setRangeWarning]);

  const handleVerseChange = useCallback((verse: number | undefined) => {
    setLocalRepeat((prev) => ({ ...prev, verseNumber: verse } as unknown as RepeatOptions));
    setRangeWarning(null);
  }, [setLocalRepeat, setRangeWarning]);

  return (
    <div className="col-span-2">
      <SurahVerseSelector
        chapters={chapters}
        isLoading={isLoading}
        selectedSurah={localRepeat.surahId}
        selectedVerse={localRepeat.verseNumber}
        onSurahChange={handleSurahChange}
        onVerseChange={handleVerseChange}
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  className,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  className?: string;
}): React.JSX.Element {
  return (
    <label className={`text-sm ${className ?? ''}`}>
      <span className="block mb-1 text-sm font-semibold text-foreground">{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        step={1}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          onChange(Number.isNaN(v) ? (min ?? value) : v);
        }}
        className="w-full rounded-lg border border-border bg-interactive/60 px-3 py-2 text-foreground placeholder:text-muted focus:border-transparent focus:ring-2 focus:ring-accent focus:outline-none transition-colors duration-150"
      />
    </label>
  );
}
