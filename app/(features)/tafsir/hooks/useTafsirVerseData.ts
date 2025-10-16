import useSWR from 'swr';

import { useSettings } from '@/app/providers/SettingsContext';
import { getVersesByChapter } from '@/lib/api';
import { ensureLanguageCode } from '@/lib/text/languageCodes';
import { GetTafsirContentUseCase } from '@/src/application/use-cases/GetTafsirContent';
import { container } from '@/src/infrastructure/di/Container';
import { Surah, Verse as VerseType } from '@/types';

import { useTafsirOptions } from './useTafsirOptions';
import { useTranslationOptions } from './useTranslationOptions';
import { useVerseNavigation } from './useVerseNavigation';
import { useWordTranslations } from './useWordTranslations';

interface UseTafsirVerseDataReturn {
  verse: VerseType | undefined;
  tafsirHtml: string | undefined;
  tafsirResource: { id: number; name: string; lang: string } | undefined;
  translationOptions: { id: number; name: string; lang: string }[];
  wordLanguageOptions: { name: string; id: number }[];
  wordLanguageMap: Record<string, number>;
  selectedTranslationName: string;
  selectedTafsirName: string;
  selectedWordLanguageName: string;
  prev: { surahId: string; ayahId: number } | null;
  next: { surahId: string; ayahId: number } | null;
  navigate: (target: { surahId: string; ayahId: number } | null) => void;
  currentSurah: Surah | undefined;
  resetWordSettings: () => void;
}

export const useTafsirVerseData = (surahId: string, ayahId: string): UseTafsirVerseDataReturn => {
  const { settings } = useSettings();

  const { translationOptions, selectedTranslationName } = useTranslationOptions();
  const { tafsirResource, selectedTafsirName } = useTafsirOptions();
  const { wordLanguageOptions, wordLanguageMap, selectedWordLanguageName, resetWordSettings } =
    useWordTranslations();
  const { prev, next, navigate, currentSurah } = useVerseNavigation(surahId, ayahId);

  const wordLanguage = ensureLanguageCode(settings.wordLang);

  const { data: verseData } = useSWR(
    surahId && ayahId
      ? (['verse', surahId, ayahId, settings.translationIds.join(','), wordLanguage] as const)
      : null,
    ([, s, a, trIds, lang]) =>
      getVersesByChapter({
        id: s,
        translationIds: (trIds as string).split(',').map((n) => Number(n)).filter(Boolean),
        page: Number(a),
        perPage: 1,
        wordLang: lang,
      }).then((d) => d.verses[0])
  );
  const verse: VerseType | undefined = verseData;

  const repository = container.getTafsirRepository();
  const tafsirUseCase = new GetTafsirContentUseCase(repository);

  const { data: tafsirHtml } = useSWR(
    verse && tafsirResource ? ['tafsir', verse.verse_key, tafsirResource.id] : null,
    ([, key, id]) => tafsirUseCase.execute(key as string, id as number)
  );

  return {
    verse,
    tafsirHtml,
    tafsirResource,
    translationOptions,
    wordLanguageOptions,
    wordLanguageMap,
    selectedTranslationName,
    selectedTafsirName,
    selectedWordLanguageName,
    prev,
    next,
    navigate,
    currentSurah,
    resetWordSettings,
  };
};
