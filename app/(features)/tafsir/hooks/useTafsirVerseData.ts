import useSWR from 'swr';
import { useSettings } from '@/app/providers/SettingsContext';
import { getVersesByChapter } from '@/lib/api';
import { container } from '@/src/infrastructure/di/container';
import { GetTafsirContentUseCase } from '@/src/application/use-cases/GetTafsirContent';
import { Verse as VerseType } from '@/types';
import { useTranslationOptions } from './useTranslationOptions';
import { useTafsirOptions } from './useTafsirOptions';
import { useWordTranslations } from './useWordTranslations';
import { useVerseNavigation } from './useVerseNavigation';

export const useTafsirVerseData = (surahId: string, ayahId: string) => {
  const { settings } = useSettings();

  const { translationOptions, selectedTranslationName } = useTranslationOptions();
  const { tafsirResource, selectedTafsirName } = useTafsirOptions();
  const { wordLanguageOptions, wordLanguageMap, selectedWordLanguageName, resetWordSettings } =
    useWordTranslations();
  const { prev, next, navigate, currentSurah } = useVerseNavigation(surahId, ayahId);

  const { data: verseData } = useSWR(
    surahId && ayahId
      ? ['verse', surahId, ayahId, settings.translationId, settings.wordLang]
      : null,
    ([, s, a, trId, wordLang]) =>
      getVersesByChapter(s, trId, Number(a), 1, wordLang).then((d) => d.verses[0])
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
