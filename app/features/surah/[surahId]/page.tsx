'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Verse } from './_components/Verse';
import { SettingsSidebar } from './_components/SettingsSidebar';
import { TranslationPanel } from './_components/TranslationPanel';
import { WordLanguagePanel } from './_components/WordLanguagePanel';
import { Verse as VerseType, TranslationResource } from '@/types';
import {
  getTranslations,
  getWordTranslations,
  getVersesByChapter,
  getSurahCoverUrl,
} from '@/lib/api';
import { LANGUAGE_CODES } from '@/lib/languageCodes';
import type { LanguageCode } from '@/lib/languageCodes';
import { WORD_LANGUAGE_LABELS } from '@/lib/wordLanguages';
import { useSettings } from '@/app/context/SettingsContext';
import Spinner from '@/app/components/common/Spinner';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { QuranAudioPlayer } from '@/app/components/player';
import { useAudio } from '@/app/context/AudioContext';
import { buildAudioUrl } from '@/lib/reciters';

const DEFAULT_WORD_TRANSLATION_ID = 85;

interface SurahPageProps {
  params: { surahId: string };
}

export default function SurahPage({ params }: SurahPageProps) {
  const { surahId } = params;
  const [error, setError] = useState<string | null>(null);
  const { settings, setSettings } = useSettings();
  const { t } = useTranslation();
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [translationSearchTerm, setTranslationSearchTerm] = useState('');
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);
  const [wordTranslationSearchTerm, setWordTranslationSearchTerm] = useState('');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { activeVerse, setActiveVerse, reciter } = useAudio();

  const { data: translationOptionsData } = useSWR('translations', getTranslations);
  const translationOptions = useMemo(() => translationOptionsData || [], [translationOptionsData]);

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

  const selectedTranslationName = useMemo(
    () =>
      translationOptions.find((o) => o.id === settings.translationId)?.name ||
      t('select_translation'),
    [settings.translationId, translationOptions, t]
  );
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

  useEffect(() => {
    if (activeVerse) {
      const surahNumber = parseInt(activeVerse.verse_key.split(':')[0], 10);
      getSurahCoverUrl(surahNumber).then(setCoverUrl);
    }
  }, [activeVerse]);

  const handleNext = () => {
    if (!activeVerse) return;
    const currentIndex = verses.findIndex((v) => v.id === activeVerse.id);
    if (currentIndex < verses.length - 1) {
      setActiveVerse(verses[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (!activeVerse) return;
    const currentIndex = verses.findIndex((v) => v.id === activeVerse.id);
    if (currentIndex > 0) {
      setActiveVerse(verses[currentIndex - 1]);
    }
  };

  const track = activeVerse
    ? {
        id: activeVerse.id.toString(),
        title: `Verse ${activeVerse.verse_key}`,
        artist: reciter.name,
        coverUrl: coverUrl || '',
        durationSec: 0, // Player will determine from metadata
        src: buildAudioUrl(activeVerse.verse_key, reciter.path),
      }
    : null;

  return (
    <div className="flex flex-grow bg-white dark:bg-[var(--background)] text-[var(--foreground)] font-sans overflow-hidden">
      <main className="flex-grow bg-white dark:bg-[var(--background)] p-6 lg:p-10 overflow-y-auto homepage-scrollable-area">
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
        onReadingPanelOpen={() => {}}
        selectedTranslationName={selectedTranslationName}
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
      {activeVerse && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent z-50">
          <QuranAudioPlayer track={track} onNext={handleNext} onPrev={handlePrev} />
        </div>
      )}
    </div>
  );
}
