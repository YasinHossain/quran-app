'use client';

import React, { useEffect, useMemo, useCallback } from 'react';
import { Minus, Plus } from 'lucide-react';

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
    return (
        <div className="flex items-center p-1.5 rounded-full bg-interactive border border-border">
            {(['single', 'range', 'surah'] as const).map((m) => (
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
    );
}

function RepeatFields({
    localRepeat,
    setLocalRepeat,
    rangeWarning,
    setRangeWarning,
}: Props): React.JSX.Element {
    const isSingle = localRepeat.mode === 'single';
    const isSurah = localRepeat.mode === 'surah';
    // Include 'off' in showRange for backward compatibility
    const showRange = localRepeat.mode === 'range' || localRepeat.mode === 'off';
    const { chapters, isLoading } = useSurahNavigationData();

    return (
        <div className="rounded-xl border border-border p-4 flex flex-col gap-4">
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
                    <NumberField
                        label="Play Count"
                        value={localRepeat.playCount ?? 1}
                        min={1}
                        onChange={(v) => setLocalRepeat({ ...localRepeat, playCount: v })}
                    />
                )}
                <NumberField
                    label="Repeat Each"
                    value={localRepeat.repeatEach ?? 1}
                    min={1}
                    onChange={(v) => setLocalRepeat({ ...localRepeat, repeatEach: v })}
                />
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
                const shouldSyncEnd = !prev.endVerseNumber && !prev.end && startSurah && endSurah === startSurah;
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
                surahLabel="Start Surah"
                verseLabel="Start Verse"
            />

            <SurahVerseSelector
                chapters={chapters}
                isLoading={isLoading}
                selectedSurah={endSurahId}
                selectedVerse={selectedEndVerse}
                onSurahChange={handleEndSurahChange}
                onVerseChange={handleEndVerseChange}
                surahLabel="End Surah"
                verseLabel="End Verse"
            />
        </>
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
    const handleIncrement = () => onChange(value + 1);
    const handleDecrement = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    return (
        <div className={className}>
            <span className="block mb-1 text-sm font-semibold text-foreground">{label}</span>
            <div className="flex items-center w-full rounded-lg border border-border bg-interactive/60 text-foreground focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-colors duration-150">
                <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={value <= min}
                    className="p-2.5 text-muted hover:text-foreground disabled:opacity-30 disabled:hover:text-muted transition-colors"
                >
                    <Minus size={16} />
                </button>
                <input
                    type="number"
                    value={Number.isFinite(value) ? value : 0}
                    min={min}
                    step={1}
                    onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        onChange(Number.isNaN(v) ? (min ?? value) : v);
                    }}
                    className="flex-1 min-w-0 bg-transparent p-2 text-center text-foreground placeholder:text-muted focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                    type="button"
                    onClick={handleIncrement}
                    className="p-2.5 text-muted hover:text-foreground transition-colors"
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
}
