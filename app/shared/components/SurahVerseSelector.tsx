'use client';

import clsx from 'clsx';
import { useMemo, useId, type ReactElement } from 'react';

import { SurahSelect } from '@/app/shared/components/go-to/SurahSelect';
import type { Chapter } from '@/types';

// Helper to ensure we options match the SurahSelect format
interface SurahOption {
    value: string;
    label: string;
}

interface SurahVerseSelectorProps {
    // Data
    chapters: Chapter[];
    isLoading?: boolean;

    // Selected Values (Numbers prefered for logic, handled as strings for inputs)
    selectedSurah: number | undefined;
    selectedVerse: number | undefined;

    // Handlers
    onSurahChange: (surahId: number | undefined) => void;
    onVerseChange: (verseNumber: number | undefined) => void;

    // Customization
    surahLabel?: string;
    verseLabel?: string;
    className?: string; // Wrapper class
}

export function SurahVerseSelector({
    chapters,
    isLoading = false,
    selectedSurah,
    selectedVerse,
    onSurahChange,
    onVerseChange,
    surahLabel = 'Surah',
    verseLabel = 'Verse',
    className,
}: SurahVerseSelectorProps): ReactElement {
    const surahInputId = useId();
    const verseInputId = useId();

    // Convert chapters to options
    const surahOptions: SurahOption[] = useMemo(
        () =>
            chapters.map((chapter) => ({
                value: String(chapter.id),
                label: `${String(chapter.id).padStart(3, '0')} • ${chapter.name_simple}`,
            })),
        [chapters]
    );

    // Find active chapter to get verse count
    const activeChapter = useMemo(
        () => (selectedSurah ? chapters.find((c) => c.id === selectedSurah) : undefined),
        [chapters, selectedSurah]
    );

    // Generate verse options based on active chapter
    const verseOptions: SurahOption[] = useMemo(() => {
        if (!activeChapter?.verses_count) return [];
        return Array.from({ length: activeChapter.verses_count }, (_, index) => ({
            value: String(index + 1),
            label: String(index + 1),
        }));
    }, [activeChapter]);

    // Handlers to parse string back to number
    const handleSurahChange = (val: string) => {
        const parsed = parseInt(val, 10);
        onSurahChange(Number.isFinite(parsed) ? parsed : undefined);
    };

    const handleVerseChange = (val: string) => {
        const parsed = parseInt(val, 10);
        onVerseChange(Number.isFinite(parsed) ? parsed : undefined);
    };

    return (
        <div className={clsx('grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-3', className)}>
            <div className="w-full min-w-0">
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor={surahInputId}>
                    {surahLabel}
                </label>
                <SurahSelect
                    inputId={surahInputId}
                    value={selectedSurah ? String(selectedSurah) : ''}
                    onChange={handleSurahChange}
                    options={surahOptions}
                    placeholder={isLoading ? 'Loading surahs…' : 'Select Surah'}
                    disabled={isLoading}
                    className="w-full"
                />
            </div>

            <div className="w-full min-w-0">
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor={verseInputId}>
                    {verseLabel}
                </label>
                <SurahSelect
                    inputId={verseInputId}
                    value={selectedVerse ? String(selectedVerse) : ''}
                    onChange={handleVerseChange}
                    options={verseOptions}
                    placeholder={
                        !selectedSurah || verseOptions.length ? 'Select Verse' : 'Loading verses…'
                    }
                    disabled={!selectedSurah || !verseOptions.length || isLoading}
                    className="w-full"
                />
            </div>
        </div>
    );
}
