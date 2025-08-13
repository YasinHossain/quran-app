import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/app/providers/SettingsContext';
import { useSidebar } from '@/app/providers/SidebarContext';
import {
  getTranslations,
  getTafsirResources,
  getWordTranslations,
  getVersesByChapter,
  getTafsirByVerse,
} from '@/lib/api';
import { Verse as VerseType, TranslationResource, TafsirResource, Surah } from '@/types';
import { WORD_LANGUAGE_LABELS } from '@/lib/text/wordLanguages';
import { LANGUAGE_CODES } from '@/lib/text/languageCodes';
import type { LanguageCode } from '@/lib/text/languageCodes';
import surahs from '@/data/surahs.json';

const DEFAULT_WORD_TRANSLATION_ID = 85;

export const useTafsirVerseData = (surahId: string, ayahId: string) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { settings, setSettings } = useSettings();
  const { setSurahListOpen } = useSidebar();

  const { data: translationOptionsData } = useSWR('translations', getTranslations);
  const translationOptions: TranslationResource[] = useMemo(
    () => translationOptionsData || [],
    [translationOptionsData]
  );

  const { data: tafsirOptionsData } = useSWR('tafsirs', getTafsirResources);
  const tafsirOptions: TafsirResource[] = useMemo(
    () => tafsirOptionsData || [],
    [tafsirOptionsData]
  );

  const { data: wordTranslationOptionsData } = useSWR('wordTranslations', getWordTranslations);
  const wordLanguageMap = useMemo(() => {
    const map: Record<string, number> = {};
    (wordTranslationOptionsData || []).forEach((o) => {
      const name = o.language_name.toLowerCase();
      if (!map[name]) {
        map[name] = o.id;
      }
    });
    return map;
  }, [wordTranslationOptionsData]);
  const wordLanguageOptions = useMemo(
    () =>
      Object.keys(wordLanguageMap)
        .filter((name) => WORD_LANGUAGE_LABELS[name])
        .map((name) => ({ name: WORD_LANGUAGE_LABELS[name], id: wordLanguageMap[name] })),
    [wordLanguageMap]
  );

  const selectedTranslationName = useMemo(
    () =>
      translationOptions.find((o) => o.id === settings.translationId)?.name ||
      t('select_translation'),
    [settings.translationId, translationOptions, t]
  );
  const selectedTafsirName = useMemo(() => {
    const names = settings.tafsirIds
      .map((id) => tafsirOptions.find((o) => o.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3);
    return names.length ? names.join(', ') : t('select_tafsir');
  }, [settings.tafsirIds, tafsirOptions, t]);
  const selectedWordLanguageName = useMemo(
    () =>
      wordLanguageOptions.find(
        (o) =>
          (LANGUAGE_CODES as Record<string, LanguageCode>)[o.name.toLowerCase()] ===
          settings.wordLang
      )?.name || t('select_word_translation'),
    [settings.wordLang, wordLanguageOptions, t]
  );

  const { data: verseData } = useSWR(
    surahId && ayahId
      ? ['verse', surahId, ayahId, settings.translationId, settings.wordLang]
      : null,
    ([, s, a, trId, wordLang]) =>
      getVersesByChapter(s, trId, Number(a), 1, wordLang).then((d) => d.verses[0])
  );
  const verse: VerseType | undefined = verseData;

  const tafsirResource = useMemo(
    () => tafsirOptions.find((t) => t.id === settings.tafsirIds[0]),
    [tafsirOptions, settings.tafsirIds]
  );

  const { data: tafsirHtml } = useSWR(
    verse && tafsirResource ? ['tafsir', verse.verse_key, tafsirResource.id] : null,
    ([, key, id]) => getTafsirByVerse(key as string, id as number)
  );

  const surahList = surahs as Surah[];
  const totalSurahs = surahList.length;
  const currentSurahIndex = Number(surahId) - 1;
  const currentAyahNum = Number(ayahId);

  const prev =
    currentAyahNum > 1
      ? { surahId, ayahId: currentAyahNum - 1 }
      : currentSurahIndex > 0
        ? { surahId: String(Number(surahId) - 1), ayahId: surahList[currentSurahIndex - 1].verses }
        : null;

  const next =
    currentAyahNum < surahList[currentSurahIndex].verses
      ? { surahId, ayahId: currentAyahNum + 1 }
      : currentSurahIndex < totalSurahs - 1
        ? { surahId: String(Number(surahId) + 1), ayahId: 1 }
        : null;

  const navigate = useCallback(
    (target: { surahId: string; ayahId: number } | null) => {
      if (!target) return;
      setSurahListOpen(false);
      router.push(`/tafsir/${target.surahId}/${target.ayahId}`);
    },
    [router, setSurahListOpen]
  );

  const currentSurah = surahList.find((s) => s.number === Number(surahId));

  const resetWordSettings = useCallback(() => {
    setSettings({
      ...settings,
      wordLang: 'en',
      wordTranslationId: wordLanguageMap['english'] ?? DEFAULT_WORD_TRANSLATION_ID,
    });
  }, [settings, setSettings, wordLanguageMap]);

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
