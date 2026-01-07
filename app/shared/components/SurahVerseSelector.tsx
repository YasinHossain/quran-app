'use client';

import clsx from 'clsx';
import { useMemo, useId, useRef, type ReactElement } from 'react';

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
  onVerseSelectionComplete?: (verseNumber: number) => void;

  // Customization
  surahLabel?: string;
  verseLabel?: string;
  className?: string; // Wrapper class
  hideVerse?: boolean;
}

export function SurahVerseSelector({
  chapters,
  isLoading = false,
  selectedSurah,
  selectedVerse,
  onSurahChange,
  onVerseChange,
  onVerseSelectionComplete,
  surahLabel = 'Surah',
  verseLabel = 'Verse',
  className,
  hideVerse = false,
}: SurahVerseSelectorProps): ReactElement {
  const surahInputId = useId();
  const verseInputId = useId();
  const verseInputRef = useRef<HTMLInputElement>(null);

  // Convert chapters to options
  const surahOptions: SurahOption[] = useMemo(
    () =>
      chapters.map((chapter) => ({
        value: String(chapter.id),
        label: `${String(chapter.id)} • ${chapter.name_simple}`,
      })),
    [chapters]
  );

  // Find active chapter to get verse count
  const activeChapter = useMemo(
    () => (selectedSurah && !hideVerse ? chapters.find((c) => c.id === selectedSurah) : undefined),
    [chapters, hideVerse, selectedSurah]
  );

  // Generate verse options based on active chapter
  const verseOptions: SurahOption[] = useMemo(() => {
    if (hideVerse || !activeChapter?.verses_count) return [];
    return Array.from({ length: activeChapter.verses_count }, (_, index) => ({
      value: String(index + 1),
      label: String(index + 1),
    }));
  }, [activeChapter, hideVerse]);

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
    <div
      className={clsx(
        'grid gap-3',
        hideVerse ? 'grid-cols-1' : 'grid-cols-[minmax(0,3fr)_minmax(0,2fr)]',
        className
      )}
    >
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
          onSelectionComplete={() => {
            if (!hideVerse) {
              verseInputRef.current?.focus();
            }
          }}
        />
      </div>

      {!hideVerse && (
        <div className="w-full min-w-0">
          <label
            className="block text-sm font-semibold text-foreground mb-2"
            htmlFor={verseInputId}
          >
            {verseLabel}
          </label>
          <SurahSelect
            ref={verseInputRef}
            inputId={verseInputId}
            value={selectedVerse ? String(selectedVerse) : ''}
            onChange={handleVerseChange}
            options={verseOptions}
            placeholder={!selectedSurah || verseOptions.length ? 'Select Verse' : 'Loading verses…'}
            disabled={!selectedSurah || !verseOptions.length || isLoading}
            className="w-full"
            onSelectionComplete={(val) => {
              const parsed = parseInt(val, 10);
              if (Number.isFinite(parsed)) {
                onVerseSelectionComplete?.(parsed);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
