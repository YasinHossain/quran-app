import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';
import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';
import { buildSurahRoute } from '@/app/shared/navigation/routes';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import {
  hasNonIntegerValues,
  adjustRange,
  deriveRangeBoundaries,
} from '@/app/shared/player/utils/repeat';
import { getVerseByKey } from '@/lib/api/verses';
import { ensureLanguageCode } from '@/lib/text/languageCodes';

import type { RepeatOptions } from '@/app/shared/player/types';

/**
 * Local state manager for playback options and reciter selection.
 *
 * @param onClose callback to close the options modal.
 * @returns current selections and helpers to commit changes.
 */
interface UsePlaybackOptionsReturn {
  localReciter: number;
  setLocalReciter: Dispatch<SetStateAction<number>>;
  localRepeat: RepeatOptions;
  setLocalRepeat: Dispatch<SetStateAction<RepeatOptions>>;
  rangeWarning: string | null;
  setRangeWarning: Dispatch<SetStateAction<string | null>>;
  commit: () => void;
}

export function usePlaybackOptions(isOpen: boolean, onClose: () => void): UsePlaybackOptionsReturn {
  const router = useRouter();
  const pathname = usePathname();
  const {
    reciter,
    setReciterId,
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
  const { chapters } = useSurahNavigationData();
  const translationIds = useMemo(() => {
    const ids = settings.translationIds?.filter((id) => Number.isFinite(id));
    if (ids?.length) return ids;
    if (Number.isFinite(settings.translationId)) return [settings.translationId];
    return [20];
  }, [settings.translationId, settings.translationIds]);
  const wordLang = useMemo(() => ensureLanguageCode(settings.wordLang), [settings.wordLang]);
  const [localReciter, setLocalReciter] = useState(reciter.id);
  const [localRepeat, setLocalRepeat] = useState<RepeatOptions>(repeatOptions);
  const [rangeWarning, setRangeWarning] = useState<string | null>(null);
  const activeVerseRef = useRef(activeVerse);

  useEffect(() => {
    activeVerseRef.current = activeVerse;
  }, [activeVerse]);

  const activeVerseNumber = useMemo((): number | undefined => {
    const key = activeVerse?.verse_key;
    if (!key) return undefined;
    const [, verse] = key.split(':');
    const parsed = Number.parseInt(verse ?? '', 10);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [activeVerse?.verse_key]);

  useEffect(() => {
    if (!isOpen) return;
    setLocalReciter(reciter.id);

    const activeVerseSnapshot = activeVerseRef.current;
    const activeSurahId = activeVerseSnapshot?.chapter_id;
    const activeVerseNumberSnapshot = (() => {
      const key = activeVerseSnapshot?.verse_key;
      if (!key) return undefined;
      const [, verse] = key.split(':');
      const parsed = Number.parseInt(verse ?? '', 10);
      return Number.isFinite(parsed) ? parsed : undefined;
    })();
    const effectiveMode = repeatOptions.mode === 'off' ? 'single' : repeatOptions.mode;

    const singleDefaults: Partial<RepeatOptions> =
      effectiveMode === 'single'
        ? {
            surahId: repeatOptions.surahId ?? activeSurahId,
            verseNumber: repeatOptions.verseNumber ?? activeVerseNumberSnapshot,
            start: repeatOptions.verseNumber ?? activeVerseNumberSnapshot ?? repeatOptions.start,
            end: repeatOptions.verseNumber ?? activeVerseNumberSnapshot ?? repeatOptions.end,
          }
        : {};
    const surahDefaults: Partial<RepeatOptions> =
      effectiveMode === 'surah'
        ? {
            surahId: repeatOptions.surahId ?? activeSurahId,
            verseNumber: undefined,
            start: 1,
            end: 1,
          }
        : {};
    const baseRangeDefaults: Partial<RepeatOptions> = {
      startSurahId: repeatOptions.startSurahId ?? repeatOptions.surahId ?? activeSurahId,
      endSurahId:
        repeatOptions.endSurahId ??
        repeatOptions.startSurahId ??
        repeatOptions.surahId ??
        activeSurahId,
      startVerseNumber:
        repeatOptions.startVerseNumber ?? repeatOptions.start ?? activeVerseNumberSnapshot ?? 1,
      endVerseNumber:
        repeatOptions.endVerseNumber ??
        repeatOptions.end ??
        repeatOptions.startVerseNumber ??
        repeatOptions.start ??
        activeVerseNumberSnapshot ??
        1,
      rangeSize: repeatOptions.rangeSize,
    };
    const rangeDefaults: Partial<RepeatOptions> =
      effectiveMode === 'range'
        ? {
            ...baseRangeDefaults,
            start:
              baseRangeDefaults.startVerseNumber ??
              repeatOptions.start ??
              activeVerseNumberSnapshot ??
              1,
            end:
              baseRangeDefaults.endVerseNumber ??
              baseRangeDefaults.startVerseNumber ??
              repeatOptions.end ??
              activeVerseNumberSnapshot ??
              1,
          }
        : baseRangeDefaults;

    setLocalRepeat({
      ...repeatOptions,
      mode: effectiveMode,
      ...singleDefaults,
      ...surahDefaults,
      ...rangeDefaults,
    });
  }, [isOpen, reciter.id, repeatOptions]);

  const commit = (): void => {
    const applyChanges = async (): Promise<void> => {
      setRangeWarning(null);

      if (hasNonIntegerValues(localRepeat)) {
        setRangeWarning('Please enter whole numbers only.');
        return;
      }

      // Update reciter if changed
      if (localReciter !== reciter.id) {
        setReciterId(localReciter);
      }

      if (localRepeat.mode === 'single') {
        const surahId = localRepeat.surahId ?? activeVerse?.chapter_id;
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

          const href = buildSurahRoute(surahId, { startVerse: normalizedVerse, forceSeq: true });
          const locale = getLocaleFromPathname(pathname) ?? 'en';
          router.push(localizeHref(href, locale), { scroll: false });

          onClose();
        } catch {
          setRangeWarning('Unable to load the selected verse. Please try again.');
        }
        return;
      }

      if (localRepeat.mode === 'surah') {
        const surahId = localRepeat.surahId ?? activeVerse?.chapter_id;
        if (!surahId) {
          setRangeWarning('Select a surah to repeat.');
          return;
        }
        const nextRepeat: RepeatOptions = {
          ...localRepeat,
          mode: 'surah',
          surahId,
          verseNumber: undefined,
          start: 1,
          end: 1,
          playCount: localRepeat.playCount ?? 1,
          repeatEach: localRepeat.repeatEach ?? 1,
          delay: localRepeat.delay ?? 0,
        };
        try {
          const verseKey = `${surahId}:1`;
          const verse = await getVerseByKey(verseKey, translationIds, wordLang);
          setActiveVerse(verse);
          setPlayingId(verse.id);
          setLoadingId(verse.id);
          setIsPlaying(true);
          openPlayer();
          setRangeWarning(null);
          setRepeatOptions(nextRepeat);

          const href = buildSurahRoute(surahId, { startVerse: 1, forceSeq: true });
          const locale = getLocaleFromPathname(pathname) ?? 'en';
          router.push(localizeHref(href, locale), { scroll: false });

          onClose();
        } catch {
          setRangeWarning('Unable to load the selected surah. Please try again.');
        }
        return;
      }

      if (localRepeat.mode === 'range') {
        const range = deriveRangeBoundaries(localRepeat, chapters);
        if (!range) {
          setRangeWarning('Select a start and end surah and verse to repeat.');
          return;
        }
        const nextRepeat: RepeatOptions = {
          ...localRepeat,
          mode: 'range',
          surahId: range.startSurahId,
          startSurahId: range.startSurahId,
          startVerseNumber: range.startVerseNumber,
          endSurahId: range.endSurahId,
          endVerseNumber: range.endVerseNumber,
          start: range.startVerseNumber,
          end: range.endVerseNumber,
          rangeSize: range.rangeSize,
          playCount: localRepeat.playCount ?? 1,
          repeatEach: localRepeat.repeatEach ?? 1,
          delay: localRepeat.delay ?? 0,
        };
        try {
          const verse = await getVerseByKey(range.startKey, translationIds, wordLang);
          setActiveVerse(verse);
          setPlayingId(verse.id);
          setLoadingId(verse.id);
          setIsPlaying(true);
          openPlayer();
          setRangeWarning(null);
          setRepeatOptions(nextRepeat);

          const href = buildSurahRoute(range.startSurahId, {
            startVerse: range.startVerseNumber,
            forceSeq: true,
          });
          const locale = getLocaleFromPathname(pathname) ?? 'en';
          router.push(localizeHref(href, locale), { scroll: false });

          onClose();
        } catch {
          setRangeWarning('Unable to load the selected range. Please try again.');
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
