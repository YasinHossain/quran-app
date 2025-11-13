'use client';

import clsx from 'clsx';
import { memo, type FormEvent, type ReactElement, useCallback, useMemo, useState } from 'react';

import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';
import { SurahSelect, type SurahOption } from '@/app/shared/components/go-to/SurahSelect';

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
  subtitle = 'Select a surah & verse',
  buttonLabel = 'Go',
}: GoToSurahVerseFormProps): ReactElement {
  const [selectedSurah, setSelectedSurah] = useState('');
  const [verse, setVerse] = useState('');
  const { chapters, isLoading } = useSurahNavigationData();

  const surahOptions: SurahOption[] = useMemo(
    () =>
      chapters.map((chapter) => ({
        value: String(chapter.id),
        label: `${String(chapter.id).padStart(3, '0')} • ${chapter.name_simple}`,
      })),
    [chapters]
  );

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
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-foreground">{title}</div>
        {subtitleText ? <div className="text-xs text-muted">{subtitleText}</div> : null}
      </div>

      <div className="grid grid-cols-1 gap-2">
        <div>
          <label className="block text-xs text-muted mb-1" htmlFor="go-to-surah">
            Surah
          </label>
          <SurahSelect
            value={selectedSurah}
            onChange={setSelectedSurah}
            options={surahOptions}
            placeholder={isLoading ? 'Loading surahs…' : 'Select a surah'}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs text-muted mb-1" htmlFor="go-to-verse">
            Verse (optional)
          </label>
          <input
            id="go-to-verse"
            type="number"
            inputMode="numeric"
            min={1}
            value={verse}
            onChange={(event): void => setVerse(event.target.value)}
            placeholder="e.g., 247"
            className="w-full rounded-2xl border border-border bg-interactive/60 text-foreground text-sm px-3 py-2 min-h-touch focus-visible:outline-none focus-visible:border-accent transition-shadow"
          />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-accent text-on-accent text-sm font-medium transition-colors hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  );
});
