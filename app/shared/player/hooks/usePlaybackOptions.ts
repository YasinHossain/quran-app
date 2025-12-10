import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import { hasNonIntegerValues, adjustRange } from '@/app/shared/player/utils/repeat';
import { getVerseByKey } from '@/lib/api/verses';
import { RECITERS } from '@/lib/audio/reciters';
import { ensureLanguageCode } from '@/lib/text/languageCodes';

import type { RepeatOptions } from '@/app/shared/player/types';

/**
 * Local state manager for playback options and reciter selection.
 *
 * @param onClose callback to close the options modal.
 * @returns current selections and helpers to commit changes.
 */
interface UsePlaybackOptionsReturn {
  localReciter: string;
  setLocalReciter: Dispatch<SetStateAction<string>>;
  localRepeat: RepeatOptions;
  setLocalRepeat: Dispatch<SetStateAction<RepeatOptions>>;
  rangeWarning: string | null;
  setRangeWarning: Dispatch<SetStateAction<string | null>>;
  commit: () => void;
}

export function usePlaybackOptions(isOpen: boolean, onClose: () => void): UsePlaybackOptionsReturn {
  const {
    reciter,
    setReciter,
    repeatOptions,
    setRepeatOptions,
    activeVerse,
    setActiveVerse,
    setPlayingId,
    setLoadingId,
    setIsPlaying,
    openPlayer,
  } = useAudio();
  const { settings } = useSettings();
  const translationIds = useMemo(() => {
    const ids = settings.translationIds?.filter((id) => Number.isFinite(id));
    if (ids?.length) return ids;
    if (Number.isFinite(settings.translationId)) return [settings.translationId];
    return [20];
  }, [settings.translationId, settings.translationIds]);
  const wordLang = useMemo(() => ensureLanguageCode(settings.wordLang), [settings.wordLang]);
  const [localReciter, setLocalReciter] = useState(reciter.id.toString());
  const [localRepeat, setLocalRepeat] = useState<RepeatOptions>(repeatOptions);
  const [rangeWarning, setRangeWarning] = useState<string | null>(null);

  const parseActiveVerseNumber = (): number | undefined => {
    const key = activeVerse?.verse_key;
    if (!key) return undefined;
    const [, verse] = key.split(':');
    const parsed = Number.parseInt(verse ?? '', 10);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  useEffect(() => {
    if (isOpen) {
      setLocalReciter(reciter.id.toString());
      const activeVerseNumber = parseActiveVerseNumber();
      const singleDefaults: Partial<RepeatOptions> =
        repeatOptions.mode === 'single'
          ? {
              surahId: repeatOptions.surahId ?? activeVerse?.chapter_id,
              verseNumber: repeatOptions.verseNumber ?? activeVerseNumber,
              start: repeatOptions.verseNumber ?? activeVerseNumber ?? repeatOptions.start,
              end: repeatOptions.verseNumber ?? activeVerseNumber ?? repeatOptions.end,
            }
          : {};
      setLocalRepeat({ ...repeatOptions, ...singleDefaults });
    }
  }, [isOpen, reciter, repeatOptions, activeVerse]);

  const commit = (): void => {
    const applyChanges = async (): Promise<void> => {
      setRangeWarning(null);

      if (hasNonIntegerValues(localRepeat)) {
        setRangeWarning('Please enter whole numbers only.');
        return;
      }
      const newReciter = RECITERS.find((r) => r.id.toString() === localReciter);
      if (newReciter) setReciter(newReciter);

      if (localRepeat.mode === 'single') {
        const surahId = localRepeat.surahId ?? activeVerse?.chapter_id;
        const activeVerseNumber = parseActiveVerseNumber();
        const verseNumber =
          localRepeat.verseNumber ??
          (surahId && activeVerse?.chapter_id === surahId ? activeVerseNumber : undefined);
        if (!surahId || !verseNumber) {
          setRangeWarning('Select a surah and verse to repeat.');
          return;
        }
        const normalizedVerse = Math.max(1, verseNumber);
        const nextRepeat: RepeatOptions = {
          ...localRepeat,
          mode: 'single',
          surahId,
          verseNumber: normalizedVerse,
          start: normalizedVerse,
          end: normalizedVerse,
          playCount: 1,
        };
        try {
          const verseKey = `${surahId}:${normalizedVerse}`;
          const verse = await getVerseByKey(verseKey, translationIds, wordLang);
          setActiveVerse(verse);
          setPlayingId(verse.id);
          setLoadingId(verse.id);
          setIsPlaying(true);
          openPlayer();
          setRangeWarning(null);
          setRepeatOptions(nextRepeat);
          onClose();
        } catch (error) {
          setRangeWarning('Unable to load the selected verse. Please try again.');
        }
        return;
      }

      const { start, end, adjusted } = adjustRange(localRepeat);
      if (adjusted) {
        setRangeWarning('Start and end values adjusted to a valid range.');
        setLocalRepeat({ ...localRepeat, start, end });
        return;
      }
      setRangeWarning(null);
      setRepeatOptions({ ...localRepeat, start, end });
      onClose();
    };

    void applyChanges();
  };

  return {
    localReciter,
    setLocalReciter,
    localRepeat,
    setLocalRepeat,
    rangeWarning,
    setRangeWarning,
    commit,
  };
}
