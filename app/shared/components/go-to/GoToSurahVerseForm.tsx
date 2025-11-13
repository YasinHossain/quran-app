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

import { SurahSelect, type SurahOption } from '@/app/shared/components/go-to/SurahSelect';
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
  const [selectedSurah, setSelectedSurah] = useState('');
  const [verse, setVerse] = useState('');
  const { chapters, isLoading } = useSurahNavigationData();
  const formInstanceId = useId();
  const surahInputId = `${formInstanceId}-surah`;
  const verseInputId = `${formInstanceId}-verse`;

  const surahOptions: SurahOption[] = useMemo(
    () =>
      chapters.map((chapter) => ({
        value: String(chapter.id),
        label: `${String(chapter.id).padStart(3, '0')} • ${chapter.name_simple}`,
      })),
    [chapters]
  );

  const selectedChapter = useMemo(
    () => chapters.find((chapter) => String(chapter.id) === selectedSurah),
    [chapters, selectedSurah]
  );

  const verseOptions = useMemo(() => {
    if (!selectedChapter?.verses_count) return [];
    return Array.from({ length: selectedChapter.verses_count }, (_, index) => String(index + 1));
  }, [selectedChapter]);

  const verseSelectOptions: SurahOption[] = useMemo(
    () => verseOptions.map((value) => ({ value, label: value })),
    [verseOptions]
  );

  useEffect(() => {
    if (!selectedSurah) {
      setVerse('');
      return;
    }
    if (!verseOptions.length) {
      setVerse('');
      return;
    }
    if (verse && !verseOptions.includes(verse)) {
      setVerse(verseOptions[verseOptions.length - 1] ?? '');
    }
  }, [selectedSurah, verseOptions, verse]);

  const clampVerse = useCallback(
    (rawVerse: string, surahId: string): number | undefined => {
      const trimmed = rawVerse.trim();
      if (!trimmed) return undefined;
      const parsed = Number.parseInt(trimmed, 10);
      if (!Number.isFinite(parsed)) return undefined;
      const minClamped = Math.max(parsed, 1);
      const chapter = chapters.find((c) => String(c.id) === surahId);
      if (chapter?.verses_count) {
        return Math.min(minClamped, chapter.verses_count);
      }
      return minClamped;
    },
    [chapters]
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      if (!selectedSurah) return;
      const surahId = Number.parseInt(selectedSurah, 10);
      if (!Number.isFinite(surahId)) return;
      const verseNumber = clampVerse(verse, selectedSurah);
      onNavigate(surahId, verseNumber);
      afterNavigate?.();
    },
    [afterNavigate, clampVerse, onNavigate, selectedSurah, verse]
  );

  const disabled = !selectedSurah || isLoading;
  const subtitleText = subtitle ?? (isLoading ? 'Loading surahs…' : undefined);

  return (
    <form className={clsx('p-3 space-y-3', className)} onSubmit={handleSubmit}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-foreground">{title}</div>
          {subtitleText ? <div className="text-xs text-muted">{subtitleText}</div> : null}
        </div>
        <button
          type="submit"
          className="shrink-0 px-4 py-2 rounded-xl bg-accent text-on-accent text-sm font-medium transition-colors hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          {buttonLabel}
        </button>
      </div>

      <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-3">
        <div className="w-full min-w-0">
          <label className="block text-xs text-muted mb-1" htmlFor={surahInputId}>
            Surah
          </label>
          <SurahSelect
            inputId={surahInputId}
            value={selectedSurah}
            onChange={setSelectedSurah}
            options={surahOptions}
            placeholder={isLoading ? 'Loading surahs…' : 'Select a Surah'}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <div className="w-full min-w-0">
          <label className="block text-xs text-muted mb-1" htmlFor={verseInputId}>
            Verse (optional)
          </label>
          <SurahSelect
            inputId={verseInputId}
            value={verse}
            onChange={setVerse}
            options={verseSelectOptions}
            placeholder={
              !selectedSurah ? 'Select a surah first' : verseOptions.length ? 'Select a verse' : 'Loading verses…'
            }
            disabled={!selectedSurah || !verseOptions.length || isLoading}
            clearable
            clearLabel="Clear verse selection"
            className="w-full"
          />
        </div>
      </div>
    </form>
  );
});
