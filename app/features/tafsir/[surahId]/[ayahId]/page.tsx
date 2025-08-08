'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Verse as VerseComponent } from '@/app/features/surah/[surahId]/_components/Verse';
import { SettingsSidebar } from '@/app/features/surah/[surahId]/_components/SettingsSidebar';
import { TranslationPanel } from '@/app/features/surah/[surahId]/_components/TranslationPanel';
import { TafsirPanel } from '@/app/features/surah/[surahId]/_components/TafsirPanel';
import { WordLanguagePanel } from '@/app/features/surah/[surahId]/_components/WordLanguagePanel';
import TafsirTabs from './_components/TafsirTabs';
import {
  getVersesByChapter,
  getTranslations,
  getWordTranslations,
  getTafsirResources,
  getTafsirByVerse,
} from '@/lib/api';
import { Verse as VerseType, TranslationResource, TafsirResource } from '@/types';
import { useSettings } from '@/app/context/SettingsContext';
import { useSidebar } from '@/app/context/SidebarContext';
import { WORD_LANGUAGE_LABELS } from '@/lib/wordLanguages';
import { LANGUAGE_CODES } from '@/lib/languageCodes';
import type { LanguageCode } from '@/lib/languageCodes';
import useSWR from 'swr';
import surahs from '@/data/surahs.json';
import type { Surah } from '@/types';

const DEFAULT_WORD_TRANSLATION_ID = 85;

export default function TafsirVersePage() {
  const params = useParams<{ surahId: string; ayahId: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { settings, setSettings } = useSettings();
  const { setSurahListOpen } = useSidebar();
  const surahId = params.surahId;
  const ayahId = params.ayahId;

  // Panels state
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [translationSearchTerm, setTranslationSearchTerm] = useState('');
  const [isTafsirPanelOpen, setIsTafsirPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);
  const [wordTranslationSearchTerm, setWordTranslationSearchTerm] = useState('');

  // Options and memoized helpers
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

  const groupedTranslations = useMemo(
    () =>
      translationOptions
        .filter((o) => o.name.toLowerCase().includes(translationSearchTerm.toLowerCase()))
        .reduce<Record<string, TranslationResource[]>>((acc, tr) => {
          (acc[tr.language_name] ||= []).push(tr);
          return acc;
        }, {}),
    [translationOptions, translationSearchTerm]
  );
  const filteredWordLanguages = useMemo(
    () =>
      wordLanguageOptions.filter((o) =>
        o.name.toLowerCase().includes(wordTranslationSearchTerm.toLowerCase())
      ),
    [wordLanguageOptions, wordTranslationSearchTerm]
  );

  // Translation selection and sync
  const [translationId, setTranslationId] = useState(settings.translationId);
  useEffect(() => {
    setTranslationId(settings.translationId);
  }, [settings.translationId]);

  // Tafsir resource selection
  const tafsirResource = useMemo(
    () => tafsirOptions.find((t) => t.id === settings.tafsirIds[0]),
    [tafsirOptions, settings.tafsirIds]
  );

  // Verse and tafsir text data fetching
  const { data: verseData } = useSWR(
    surahId && ayahId ? ['verse', surahId, ayahId, translationId, settings.wordLang] : null,
    ([, s, a, trId, wordLang]) =>
      getVersesByChapter(s, trId, Number(a), 1, wordLang).then((d) => d.verses[0])
  );
  const verse: VerseType | undefined = verseData;

  const { data: tafsirHtml } = useSWR(
    verse && tafsirResource ? ['tafsir', verse.verse_key, tafsirResource.id] : null,
    ([, key, id]) => getTafsirByVerse(key as string, id as number)
  );

  // Ayah navigation helpers
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

  const navigate = (target: { surahId: string; ayahId: number } | null) => {
    if (!target) return;
    setSurahListOpen(false);
    router.push(`/features/tafsir/${target.surahId}/${target.ayahId}`);
  };

  const currentSurah = surahList.find((surah) => surah.number === Number(surahId));

  return (
    <div className="flex flex-grow bg-white dark:bg-[var(--background)] text-[var(--foreground)] overflow-hidden min-h-0">
      <main className="flex-grow bg-white dark:bg-[var(--background)] overflow-y-auto p-6 lg:p-10 homepage-scrollable-area">
        <div className="w-full space-y-6">
          {/* Ayah Navigation */}
          <div className="flex items-center justify-between rounded-full bg-teal-600 text-white p-2">
            <button
              aria-label="Previous"
              disabled={!prev}
              onClick={() => navigate(prev)}
              className="flex items-center px-4 py-2 rounded-full bg-teal-600 text-white disabled:opacity-50 font-bold"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-teal-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.707 15.293a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L8.414 10l3.293 3.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>
            <div className="text-white font-bold">
              {currentSurah ? (
                <>
                  <span className="font-bold">{currentSurah.name}</span> : {ayahId}
                </>
              ) : (
                ''
              )}
            </div>
            <button
              aria-label="Next"
              disabled={!next}
              onClick={() => navigate(next)}
              className="flex items-center px-4 py-2 rounded-full bg-teal-600 text-white disabled:opacity-50 font-bold"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-teal-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.293 4.707a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L11.586 10l-3.293-3.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>
          </div>

          {/* Translation selection */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4"></div>

            {/* Ayah display */}
            {verse && <VerseComponent verse={verse} />}

            {/* Tafsir display */}
            {verse && settings.tafsirIds.length > 1 ? (
              <TafsirTabs verseKey={verse.verse_key} tafsirIds={settings.tafsirIds} />
            ) : (
              tafsirResource && (
                <div key={verse?.verse_key} className="p-4">
                  <h2 className="mb-4 text-center text-xl font-bold text-[var(--foreground)]">
                    {tafsirResource.name}
                  </h2>
                  <div
                    className="prose max-w-none whitespace-pre-wrap"
                    style={{
                      fontSize: `${settings.tafsirFontSize}px`,
                    }}
                    dangerouslySetInnerHTML={{ __html: tafsirHtml || '' }}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </main>

      {/* Sidebars and Panels */}
      <SettingsSidebar
        onTranslationPanelOpen={() => setIsTranslationPanelOpen(true)}
        onWordLanguagePanelOpen={() => setIsWordPanelOpen(true)}
        onTafsirPanelOpen={() => setIsTafsirPanelOpen(true)}
        selectedTranslationName={selectedTranslationName}
        selectedTafsirName={selectedTafsirName}
        selectedWordLanguageName={selectedWordLanguageName}
        showTafsirSetting
      />
      <TranslationPanel
        isOpen={isTranslationPanelOpen}
        onClose={() => setIsTranslationPanelOpen(false)}
        groupedTranslations={groupedTranslations}
        searchTerm={translationSearchTerm}
        onSearchTermChange={setTranslationSearchTerm}
      />
      <WordLanguagePanel
        isOpen={isWordPanelOpen}
        onClose={() => setIsWordPanelOpen(false)}
        languages={filteredWordLanguages}
        searchTerm={wordTranslationSearchTerm}
        onSearchTermChange={setWordTranslationSearchTerm}
        onReset={() => {
          setWordTranslationSearchTerm('');
          setSettings({
            ...settings,
            wordLang: 'en',
            wordTranslationId: wordLanguageMap['english'] ?? DEFAULT_WORD_TRANSLATION_ID,
          });
        }}
      />
      <TafsirPanel isOpen={isTafsirPanelOpen} onClose={() => setIsTafsirPanelOpen(false)} />
    </div>
  );
}
