'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { SurahVerseSelector } from '@/app/shared/components/SurahVerseSelector';
import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';
import { CounterInput } from '@/app/shared/ui/inputs/CounterInput';
import { TabToggle } from '@/app/shared/ui/TabToggle';

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
    <div className="md:col-span-2 flex flex-col gap-4">
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
  const { t } = useTranslation();
  const options = useMemo(
    () => [
      { value: 'single', label: t('single_verse') },
      { value: 'range', label: t('verse_range') },
      { value: 'surah', label: t('full_surah') },
    ],
    [t]
  );

  return (
    <TabToggle
      options={options}
      value={localRepeat.mode}
      onChange={(val) => setLocalRepeat({ ...localRepeat, mode: val as RepeatOptions['mode'] })}
    />
  );
}

function RepeatFields({
  localRepeat,
  setLocalRepeat,
  rangeWarning,
  setRangeWarning,
}: Props): React.JSX.Element {
  const { t } = useTranslation();
  const isSingle = localRepeat.mode === 'single';
  const isSurah = localRepeat.mode === 'surah';
  // Include 'off' in showRange for backward compatibility
  const showRange = localRepeat.mode === 'range' || localRepeat.mode === 'off';
  const { chapters, isLoading } = useSurahNavigationData();

  return (
    <div className="rounded-lg border border-border p-4 flex flex-col gap-4">
      {rangeWarning && <div className="text-sm text-status-warning">{rangeWarning}</div>}

      {/* Main Selection Area */}
      {isSingle ? (
        <SingleVerseFields
          localRepeat={localRepeat}
          setLocalRepeat={setLocalRepeat}
          setRangeWarning={setRangeWarning}
          chapters={chapters}
          isLoading={isLoading}
        />
      ) : isSurah ? (
        <SurahFields
          localRepeat={localRepeat}
          setLocalRepeat={setLocalRepeat}
          setRangeWarning={setRangeWarning}
          chapters={chapters}
          isLoading={isLoading}
        />
      ) : showRange ? (
        <RangeFields
          localRepeat={localRepeat}
          setLocalRepeat={setLocalRepeat}
          setRangeWarning={setRangeWarning}
          chapters={chapters}
          isLoading={isLoading}
        />
      ) : null}

      {/* Settings Section */}
      <div className={`grid grid-cols-1 gap-3 ${isSingle ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
        {!isSingle && (
          <CounterInput
            label={t('play_count')}
            value={localRepeat.playCount ?? 1}
            min={1}
            onChange={(v) => setLocalRepeat({ ...localRepeat, playCount: v })}
          />
        )}
        <CounterInput
          label={t('repeat_each')}
          value={localRepeat.repeatEach ?? 1}
          min={1}
          onChange={(v) => setLocalRepeat({ ...localRepeat, repeatEach: v })}
        />
        <CounterInput
          label={t('delay_seconds')}
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
  chapters,
  isLoading,
}: {
  localRepeat: RepeatOptions;
  setLocalRepeat: React.Dispatch<React.SetStateAction<RepeatOptions>>;
  setRangeWarning: React.Dispatch<React.SetStateAction<string | null>>;
  chapters: ReturnType<typeof useSurahNavigationData>['chapters'];
  isLoading: boolean;
}): React.JSX.Element {
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

  const handleSurahChange = useCallback(
    (id: number | undefined) => {
      setLocalRepeat(
        (prev) =>
          ({
            ...prev,
            surahId: id,
            verseNumber: undefined,
          }) as unknown as RepeatOptions
      );
      setRangeWarning(null);
    },
    [setLocalRepeat, setRangeWarning]
  );

  const handleVerseChange = useCallback(
    (verse: number | undefined) => {
      setLocalRepeat((prev) => ({ ...prev, verseNumber: verse }) as unknown as RepeatOptions);
      setRangeWarning(null);
    },
    [setLocalRepeat, setRangeWarning]
  );

  return (
    <SurahVerseSelector
      chapters={chapters}
      isLoading={isLoading}
      selectedSurah={localRepeat.surahId}
      selectedVerse={localRepeat.verseNumber}
      onSurahChange={handleSurahChange}
      onVerseChange={handleVerseChange}
    />
  );
}

function SurahFields({
  localRepeat,
  setLocalRepeat,
  setRangeWarning,
  chapters,
  isLoading,
}: {
  localRepeat: RepeatOptions;
  setLocalRepeat: React.Dispatch<React.SetStateAction<RepeatOptions>>;
  setRangeWarning: React.Dispatch<React.SetStateAction<string | null>>;
  chapters: ReturnType<typeof useSurahNavigationData>['chapters'];
  isLoading: boolean;
}): React.JSX.Element {
  const noopVerseChange = useCallback(() => undefined, []);
  const handleSurahChange = useCallback(
    (id: number | undefined) => {
      setLocalRepeat((prev) => ({ ...prev, surahId: id, verseNumber: undefined }));
      setRangeWarning(null);
    },
    [setLocalRepeat, setRangeWarning]
  );

  return (
    <SurahVerseSelector
      chapters={chapters}
      isLoading={isLoading}
      selectedSurah={localRepeat.surahId}
      selectedVerse={undefined}
      onSurahChange={handleSurahChange}
      onVerseChange={noopVerseChange}
      hideVerse
    />
  );
}

function RangeFields({
  localRepeat,
  setLocalRepeat,
  setRangeWarning,
  chapters,
  isLoading,
}: {
  localRepeat: RepeatOptions;
  setLocalRepeat: React.Dispatch<React.SetStateAction<RepeatOptions>>;
  setRangeWarning: React.Dispatch<React.SetStateAction<string | null>>;
  chapters: ReturnType<typeof useSurahNavigationData>['chapters'];
  isLoading: boolean;
}): React.JSX.Element {
  const { t } = useTranslation();
  const startSurahId = localRepeat.startSurahId ?? localRepeat.surahId;
  const endSurahId = localRepeat.endSurahId ?? startSurahId;
  const selectedStartVerse = localRepeat.startVerseNumber ?? localRepeat.start;
  const selectedEndVerse = localRepeat.endVerseNumber ?? localRepeat.end;

  const startChapter = useMemo(
    () => chapters.find((chapter) => chapter.id === startSurahId),
    [chapters, startSurahId]
  );
  const endChapter = useMemo(
    () => chapters.find((chapter) => chapter.id === endSurahId),
    [chapters, endSurahId]
  );

  useEffect(() => {
    if (!startChapter?.verses_count || !selectedStartVerse) return;
    if (selectedStartVerse > startChapter.verses_count) {
      setLocalRepeat((prev) => ({
        ...prev,
        startVerseNumber: startChapter.verses_count,
        start: startChapter.verses_count,
      }));
    }
  }, [selectedStartVerse, startChapter?.verses_count, setLocalRepeat]);

  useEffect(() => {
    if (!endChapter?.verses_count || !selectedEndVerse) return;
    if (selectedEndVerse > endChapter.verses_count) {
      setLocalRepeat((prev) => ({
        ...prev,
        endVerseNumber: endChapter.verses_count,
        end: endChapter.verses_count,
      }));
    }
  }, [selectedEndVerse, endChapter?.verses_count, setLocalRepeat]);

  useEffect(() => {
    if (!startChapter || localRepeat.startVerseNumber !== undefined) return;
    setLocalRepeat((prev) => ({ ...prev, startVerseNumber: 1, start: 1 }));
  }, [localRepeat.startVerseNumber, setLocalRepeat, startChapter]);

  useEffect(() => {
    if (!endChapter || localRepeat.endVerseNumber !== undefined) return;
    setLocalRepeat((prev) => {
      const fallbackEnd = prev.startVerseNumber ?? prev.start ?? 1;
      return { ...prev, endVerseNumber: fallbackEnd, end: fallbackEnd };
    });
  }, [localRepeat.endVerseNumber, setLocalRepeat, endChapter]);

  const handleStartSurahChange = useCallback(
    (id: number | undefined) => {
      setLocalRepeat((prev) => ({
        ...prev,
        startSurahId: id,
        startVerseNumber: undefined,
        start: undefined,
        ...(prev.endSurahId ? {} : { endSurahId: id }),
      }));
      setRangeWarning(null);
    },
    [setLocalRepeat, setRangeWarning]
  );

  const handleStartVerseChange = useCallback(
    (verse: number | undefined) => {
      setLocalRepeat((prev) => {
        const startSurah = prev.startSurahId ?? prev.surahId;
        const endSurah = prev.endSurahId ?? startSurah;
        const shouldSyncEnd =
          !prev.endVerseNumber && !prev.end && startSurah && endSurah === startSurah;
        return {
          ...prev,
          startVerseNumber: verse,
          start: verse,
          ...(shouldSyncEnd ? { endVerseNumber: verse, end: verse } : {}),
        };
      });
      setRangeWarning(null);
    },
    [setLocalRepeat, setRangeWarning]
  );

  const handleEndSurahChange = useCallback(
    (id: number | undefined) => {
      setLocalRepeat((prev) => ({
        ...prev,
        endSurahId: id,
        endVerseNumber: undefined,
        end: undefined,
      }));
      setRangeWarning(null);
    },
    [setLocalRepeat, setRangeWarning]
  );

  const handleEndVerseChange = useCallback(
    (verse: number | undefined) => {
      setLocalRepeat((prev) => ({ ...prev, endVerseNumber: verse, end: verse }));
      setRangeWarning(null);
    },
    [setLocalRepeat, setRangeWarning]
  );

  return (
    <>
      <SurahVerseSelector
        chapters={chapters}
        isLoading={isLoading}
        selectedSurah={startSurahId}
        selectedVerse={selectedStartVerse}
        onSurahChange={handleStartSurahChange}
        onVerseChange={handleStartVerseChange}
        surahLabel={t('start_surah')}
        verseLabel={t('verse')}
      />

      <SurahVerseSelector
        chapters={chapters}
        isLoading={isLoading}
        selectedSurah={endSurahId}
        selectedVerse={selectedEndVerse}
        onSurahChange={handleEndSurahChange}
        onVerseChange={handleEndVerseChange}
        surahLabel={t('end_surah')}
        verseLabel={t('verse')}
      />
    </>
  );
}
