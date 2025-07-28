'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Verse as VerseComponent } from '@/app/features/surah/[surahId]/_components/Verse';
import { CollapsibleSection } from '@/app/features/surah/[surahId]/_components/CollapsibleSection';
import { SettingsSidebar } from '@/app/features/surah/[surahId]/_components/SettingsSidebar';
import { TranslationPanel } from '@/app/features/surah/[surahId]/_components/TranslationPanel';
import { TafsirPanel } from '@/app/features/surah/[surahId]/_components/TafsirPanel';
import { WordLanguagePanel } from '@/app/features/surah/[surahId]/_components/WordLanguagePanel';
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
import useSWR from 'swr';
import surahs from '@/data/surahs.json';

const DEFAULT_WORD_TRANSLATION_ID = 85;

export default function TafsirVersePage() {
  const params = useParams<{ surahId: string; ayahId: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { settings, setSettings } = useSettings();
  const { setSurahListOpen } = useSidebar();
  const surahId = params.surahId;
  const ayahId = params.ayahId;
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [translationSearchTerm, setTranslationSearchTerm] = useState('');
  const [isTafsirPanelOpen, setIsTafsirPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);
  const [wordTranslationSearchTerm, setWordTranslationSearchTerm] = useState('');

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
  const selectedTafsirName = useMemo(
    () => tafsirOptions.find((o) => o.id === settings.tafsirId)?.name || t('select_tafsir'),
    [settings.tafsirId, tafsirOptions, t]
  );
  const selectedWordLanguageName = useMemo(
    () =>
      wordLanguageOptions.find((o) => LANGUAGE_CODES[o.name.toLowerCase()] === settings.wordLang)
        ?.name || t('select_word_translation'),
    [settings.wordLang, wordLanguageOptions, t]
  );

  const groupedTranslations = useMemo(
    () =>
      translationOptions
        .filter((o) => o.name.toLowerCase().includes(translationSearchTerm.toLowerCase()))
        .reduce<Record<string, TranslationResource[]>>((acc, t) => {
          (acc[t.language_name] ||= []).push(t);
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

  const [translationId, setTranslationId] = useState(settings.translationId);

  useEffect(() => {
    setTranslationId(settings.translationId);
  }, [settings.translationId]);

  const tafsirResource = useMemo(
    () => tafsirOptions.find((t) => t.id === settings.tafsirId),
    [tafsirOptions, settings.tafsirId]
  );

  const { data: verseData } = useSWR(
    surahId && ayahId ? ['verse', surahId, ayahId, translationId, settings.wordLang] : null,
    ([, s, a, trId, wordLang]) =>
      getVersesByChapter(s, trId, Number(a), 1, wordLang).then((d) => d.verses[0])
  );
  const verse: VerseType | undefined = verseData;

  const { data: tafsirText } = useSWR(
    verse && tafsirResource ? ['tafsir', verse.verse_key, tafsirResource.id] : null,
    ([, key, id]) => getTafsirByVerse(key as string, id as number)
  );

  const totalSurahs = (surahs as { number: number; verses: number }[]).length;
  const currentSurahIndex = Number(surahId) - 1;
  const currentAyahNum = Number(ayahId);

  const prev =
    currentAyahNum > 1
      ? { surahId, ayahId: currentAyahNum - 1 }
      : currentSurahIndex > 0
        ? { surahId: String(Number(surahId) - 1), ayahId: surahs[currentSurahIndex - 1].verses }
        : null;

  const next =
    currentAyahNum < surahs[currentSurahIndex].verses
      ? { surahId, ayahId: currentAyahNum + 1 }
      : currentSurahIndex < totalSurahs - 1
        ? { surahId: String(Number(surahId) + 1), ayahId: 1 }
        : null;

  const navigate = (target: { surahId: string; ayahId: number } | null) => {
    if (!target) return;
    setSurahListOpen(false);
    router.push(`/features/tafsir/${target.surahId}/${target.ayahId}`);
  };

  return (
    <div className="flex flex-grow bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      <div className="flex-grow overflow-y-auto p-6 lg:p-10">
        <div className="w-full space-y-6">
          <div className="flex justify-between">
            <button
              disabled={!prev}
              onClick={() => navigate(prev)}
              className="px-3 py-1 rounded bg-teal-600 text-white disabled:opacity-50"
            >
              {t('previous_ayah')}
            </button>
            <button
              disabled={!next}
              onClick={() => navigate(next)}
              className="px-3 py-1 rounded bg-teal-600 text-white disabled:opacity-50"
            >
              {t('next_ayah')}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <select
                className="border p-2 rounded"
                value={translationId}
                onChange={(e) => setTranslationId(Number(e.target.value))}
              >
                {translationOptions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {verse && <VerseComponent verse={verse} />}

            {tafsirResource && (
              <CollapsibleSection
                key={verse?.verse_key}
                title={tafsirResource.name}
                icon={<></>}
                isLast
              >
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: tafsirText || '' }}
                />
              </CollapsibleSection>
            )}
          </div>
        </div>
      </div>
      <SettingsSidebar
        onTranslationPanelOpen={() => setIsTranslationPanelOpen(true)}
        onWordLanguagePanelOpen={() => setIsWordPanelOpen(true)}
        onTafsirPanelOpen={() => setIsTafsirPanelOpen(true)}
        selectedTranslationName={selectedTranslationName}
        selectedTafsirName={selectedTafsirName}
        selectedWordLanguageName={selectedWordLanguageName}
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
