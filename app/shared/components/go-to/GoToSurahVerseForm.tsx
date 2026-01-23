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
} from 'react';
import { useTranslation } from 'react-i18next';

import { SurahVerseSelector } from '@/app/shared/components/SurahVerseSelector';
import { BookOpenIcon, HashIcon } from '@/app/shared/icons';
import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';
import { Button } from '@/app/shared/ui/Button';
import { localizeDigits } from '@/lib/text/localizeNumbers';

// Search suggestion examples - just labels to fill the search box
type SearchSuggestion =
  | { icon: 'juz'; query: string; number: number }
  | { icon: 'page'; query: string; number: number }
  | { icon: 'surah'; query: string; surahId: number }
  | { icon: 'ayah'; query: string; verseKey: string };

const SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  { icon: 'juz', query: 'Juz 1', number: 1 },
  { icon: 'page', query: 'Page 1', number: 1 },
  { icon: 'surah', query: 'Surah Yasin', surahId: 36 },
  { icon: 'ayah', query: '2:255', verseKey: '2:255' },
];

interface GoToSurahVerseFormProps {
  onNavigate: (surahId: number, verse?: number) => void;
  /** Called when user clicks a search suggestion - fills the search box */
  onSearchSuggestion?: (query: string) => void;
  afterNavigate?: () => void;
  className?: string;
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
}

export const GoToSurahVerseForm = memo(function GoToSurahVerseForm({
  onNavigate,
  onSearchSuggestion,
  afterNavigate,
  className,
  title,
  subtitle,
  buttonLabel,
}: GoToSurahVerseFormProps): ReactElement {
  const { t, i18n } = useTranslation();
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
    if (activeChapter?.verses_count && verse && verse > activeChapter.verses_count) {
      setVerse(activeChapter.verses_count);
    }
  }, [selectedSurah, activeChapter, verse]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      if (!selectedSurah) return;
      onNavigate(selectedSurah, verse);
      afterNavigate?.();
    },
    [afterNavigate, onNavigate, selectedSurah, verse]
  );

  const handleVerseComplete = useCallback(
    (verseNum: number) => {
      if (selectedSurah) {
        onNavigate(selectedSurah, verseNum);
        afterNavigate?.();
      }
    },
    [afterNavigate, onNavigate, selectedSurah]
  );

  // Get icon for suggestion type
  const getSuggestionIcon = (iconType: string): ReactElement => {
    switch (iconType) {
      case 'juz':
        return <span className="text-[10px] font-bold text-accent">J</span>;
      case 'page':
        return <span className="text-[10px] font-bold text-accent">P</span>;
      case 'surah':
        return <BookOpenIcon size={14} className="text-accent" />;
      case 'ayah':
        return <HashIcon size={14} className="text-accent" />;
      default:
        return <BookOpenIcon size={14} className="text-accent" />;
    }
  };

  const disabled = !selectedSurah || isLoading;
  const subtitleText = subtitle ?? (isLoading ? t('loading_surahs') : undefined);
  const resolvedTitle = title ?? t('search_or_go_to');
  const resolvedButtonLabel = buttonLabel ?? t('go');

  return (
    <form
      className={clsx('pt-4 px-6 pb-6 sm:pt-5 sm:px-8 sm:pb-8 space-y-4 text-left', className)}
      onSubmit={handleSubmit}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="text-lg font-semibold text-foreground leading-tight">{resolvedTitle}</div>
          {subtitleText ? <div className="text-sm text-muted">{subtitleText}</div> : null}
        </div>
        <Button
          type="submit"
          disabled={disabled}
          size="sm"
          className="rounded-lg px-6 min-h-0 h-8 flex-shrink-0"
        >
          {resolvedButtonLabel}
        </Button>
      </div>

      <SurahVerseSelector
        chapters={chapters}
        isLoading={isLoading}
        selectedSurah={selectedSurah}
        selectedVerse={verse}
        onSurahChange={setSelectedSurah}
        onVerseChange={setVerse}
        onVerseSelectionComplete={handleVerseComplete}
      />

      {/* Search Suggestions - clicking fills the search box */}
      {onSearchSuggestion && (
        <div className="pt-3 border-t border-border/50">
          <div className="text-xs font-medium text-muted mb-2">{t('or_try_searching')}</div>
          <div className="grid grid-cols-2 gap-1.5">
            {SEARCH_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.query}
                type="button"
                onClick={() => onSearchSuggestion(suggestion.query)}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors hover:bg-interactive/60 group"
              >
                <div className="w-5 h-5 rounded bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                  {getSuggestionIcon(suggestion.icon)}
                </div>
                <span className="text-sm text-foreground truncate">
                  {suggestion.icon === 'juz'
                    ? t('juz_number', { number: suggestion.number })
                    : suggestion.icon === 'page'
                      ? t('page_number_label', { number: suggestion.number })
                      : suggestion.icon === 'surah'
                        ? `${t('surah_tab')} ${t(
                            `surah_names.${suggestion.surahId}`,
                            `Surah ${suggestion.surahId}`
                          )}`
                        : localizeDigits(suggestion.verseKey, i18n.language)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
});
