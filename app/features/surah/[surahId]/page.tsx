'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Verse } from './_components/Verse';
import { SettingsSidebar } from './_components/SettingsSidebar';
import { TranslationPanel } from './_components/TranslationPanel';
import { TafsirPanel } from './_components/TafsirPanel';
import { WordLanguagePanel } from './_components/WordLanguagePanel';
import { Verse as VerseType, TranslationResource } from '@/types';
import { getTranslations, getWordTranslations, getVersesByChapter } from '@/lib/api';
import { getTafsirResources } from '@/lib/api';
import { LANGUAGE_CODES } from '@/lib/languageCodes';
import { WORD_LANGUAGE_LABELS } from '@/lib/wordLanguages';
import { useSettings } from '@/app/context/SettingsContext';
import { useAudio } from '@/app/context/AudioContext';
import Spinner from '@/app/components/common/Spinner';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { useTheme } from '@/app/context/ThemeContext';

const DEFAULT_WORD_TRANSLATION_ID = 85;

interface SurahPageProps {
  params: { surahId: string };
}

export default function SurahPage({ params }: SurahPageProps) {
  const { surahId } = params;
  const [error, setError] = useState<string | null>(null);
  const { settings, setSettings } = useSettings();
  const { t } = useTranslation();
  const { playingId, setPlayingId, setLoadingId } = useAudio();
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [translationSearchTerm, setTranslationSearchTerm] = useState('');
  const [isTafsirPanelOpen, setIsTafsirPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);
  const [wordTranslationSearchTerm, setWordTranslationSearchTerm] = useState('');
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Ensure theme context initialization (for css var setup)
  useTheme();

  const { data: translationOptionsData } = useSWR('translations', getTranslations);
  const translationOptions = useMemo(() => translationOptionsData || [], [translationOptionsData]);

  const { data: tafsirOptionsData } = useSWR('tafsirs', getTafsirResources);
  const tafsirOptions = useMemo(() => tafsirOptionsData || [], [tafsirOptionsData]);

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

  const { data, size, setSize, isValidating } = useSWRInfinite(
    (index) =>
      surahId ? ['verses', surahId, settings.translationId, settings.wordLang, index + 1] : null,
    ([, surahId, translationId, wordLang, page]) =>
      getVersesByChapter(surahId, translationId, page, 20, wordLang).catch((err) => {
        setError(`Failed to load content. ${err.message}`);
        return { verses: [], totalPages: 1 };
      })
  );

  const verses: VerseType[] = data ? data.flatMap((d) => d.verses) : [];
  const totalPages = data ? data[data.length - 1]?.totalPages : 1;
  const isLoading = !data && !error;
  const isReachingEnd = size >= totalPages;

  // --- Infinite Scroll Effect ---
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isReachingEnd && !isValidating) {
        setSize(size + 1);
      }
    });
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [isReachingEnd, isValidating, size, setSize]);

  // --- Memoized Values ---
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

  return (
    <div className="flex flex-grow bg-[var(--background)] text-[var(--foreground)] font-sans overflow-hidden">
      <main className="flex-grow bg-[var(--background)] p-6 lg:p-10 overflow-y-auto homepage-scrollable-area">
        <div className="w-full relative">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner className="h-8 w-8 text-teal-600" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>
          ) : verses.length > 0 ? (
            <>
              {verses.map((v) => (
                <React.Fragment key={v.id}>
                  <Verse verse={v} />
                  {playingId === v.id && v.audio?.url && (
                    <audio
                      src={`https://verses.quran.com/${v.audio.url}`}
                      autoPlay
                      onLoadStart={() => setLoadingId(v.id)}
                      onWaiting={() => setLoadingId(v.id)}
                      onPlaying={() => setLoadingId(null)}
                      onCanPlay={() => setLoadingId(null)}
                      onEnded={() => {
                        setPlayingId(null);
                        setLoadingId(null);
                      }}
                      onError={() => {
                        setError(t('could_not_play_audio'));
                        setPlayingId(null);
                        setLoadingId(null);
                      }}
                    >
                      <track kind="captions" />
                    </audio>
                  )}
                </React.Fragment>
              ))}
              <div ref={loadMoreRef} className="py-4 text-center space-x-2">
                {isValidating && <Spinner className="inline h-5 w-5 text-teal-600" />}
                {isReachingEnd && <span className="text-gray-500">{t('end_of_surah')}</span>}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-gray-500">{t('no_verses_found')}</div>
          )}
        </div>
      </main>
      <SettingsSidebar
        onTranslationPanelOpen={() => setIsTranslationPanelOpen(true)}
        onWordLanguagePanelOpen={() => setIsWordPanelOpen(true)}
        onTafsirPanelOpen={() => setIsTafsirPanelOpen(true)}
        onReadingPanelOpen={() => {}}
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
