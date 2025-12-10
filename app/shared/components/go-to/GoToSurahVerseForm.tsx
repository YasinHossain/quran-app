'use client';

import clsx from 'clsx';
import {
  memo,
  type FormEvent,
  type ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useId,
} from 'react';

import { SurahVerseSelector } from '@/app/shared/components/SurahVerseSelector';
import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';

interface GoToSurahVerseFormProps {
  onNavigate: (surahId: number, verse?: number) => void;
  afterNavigate?: () => void;
  className?: string;
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
}

export const GoToSurahVerseForm = memo(function GoToSurahVerseForm({
  onNavigate,
  afterNavigate,
  className,
  title = 'Search or Go To',
  subtitle,
  buttonLabel = 'Go',
}: GoToSurahVerseFormProps): ReactElement {
  /* State is now stored as numbers to match SurahVerseSelector */
  const [selectedSurah, setSelectedSurah] = useState<number | undefined>(undefined);
  const [verse, setVerse] = useState<number | undefined>(undefined);
  const { chapters, isLoading } = useSurahNavigationData();

  const activeChapter = useMemo(
    () => (selectedSurah ? chapters.find((c) => c.id === selectedSurah) : undefined),
    [chapters, selectedSurah]
  );

  // Reset verse if surah changes or if invalid
  useEffect(() => {
    if (!selectedSurah) {
      setVerse(undefined);
      return;
    }
    // Logic to clamp verse or clear it if out of bounds could go here
    // But the Selector handles the UI options. 
    // We just ensure data consistency.
    if (activeChapter?.verses_count && verse && verse > activeChapter.verses_count) {
      setVerse(activeChapter.verses_count);
    }
  }, [selectedSurah, activeChapter, verse]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      if (!selectedSurah) return;
      // Verse is optional in logic, but if provided, use it
      onNavigate(selectedSurah, verse);
      afterNavigate?.();
    },
    [afterNavigate, onNavigate, selectedSurah, verse]
  );

  const disabled = !selectedSurah || isLoading;
  const subtitleText = subtitle ?? (isLoading ? 'Loading surahs…' : undefined);

  return (
    <form className={clsx('p-4 sm:p-5 space-y-4', className)} onSubmit={handleSubmit}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-foreground leading-tight">{title}</div>
          {subtitleText ? <div className="text-sm text-muted">{subtitleText}</div> : null}
        </div>
        <button
          type="submit"
          className="shrink-0 px-4 py-2 rounded-xl bg-accent text-on-accent text-sm font-medium transition-colors hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          {buttonLabel}
        </button>
      </div>

      <SurahVerseSelector
        chapters={chapters}
        isLoading={isLoading}
        selectedSurah={selectedSurah}
        selectedVerse={verse}
        onSurahChange={setSelectedSurah}
        onVerseChange={setVerse}
        verseLabel="Verse (optional)"
      />
    </form>
  );
});
