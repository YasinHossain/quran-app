'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Verse } from '@/app/features/surah/[surahId]/_components/Verse';
import { SettingsSidebar } from '@/app/features/surah/[surahId]/_components/SettingsSidebar';
import { TranslationPanel } from '@/app/features/surah/[surahId]/_components/TranslationPanel';
import { WordTranslationPanel } from '@/app/features/surah/[surahId]/_components/WordTranslationPanel';
import { Verse as VerseType, TranslationResource } from '@/types';
import { getTranslations, getWordTranslations, getVersesByPage } from '@/lib/api';
import { useSettings } from '@/app/context/SettingsContext';
import { useAudio } from '@/app/context/AudioContext';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

const DEFAULT_WORD_TRANSLATION_ID = 85;
const ALLOWED_WORD_LANGUAGES = ['english', 'bengali', 'indonesian', 'turkish', 'hindi'];

interface LanguageOption {
  language_name: string;
  id: number;
}

interface QuranPageProps {
  params: { pageId: string };
}

export default function QuranPage({ params }: QuranPageProps) {
  const { pageId } = params;

  const [error, setError] = useState<string | null>(null);
  const { settings, setSettings } = useSettings();
  const { t } = useTranslation();
  const { playingId, setPlayingId } = useAudio();
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [translationSearchTerm, setTranslationSearchTerm] = useState('');
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);
  const [wordTranslationSearchTerm, setWordTranslationSearchTerm] = useState('');
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data: translationOptionsData } = useSWR('translations', getTranslations);
  const translationOptions = useMemo(() => translationOptionsData || [], [translationOptionsData]);
  const { data: wordTranslationOptionsData } = useSWR('wordTranslations', getWordTranslations);
  const wordTranslationOptions = useMemo(
    () =>
      (wordTranslationOptionsData || []).filter((o) =>
        ALLOWED_WORD_LANGUAGES.includes(o.language_name.toLowerCase())
      ),
    [wordTranslationOptionsData]
  );

  const { data, size, setSize, isValidating } = useSWRInfinite(
    (index) =>
      pageId ? ['verses', pageId, settings.translationId, settings.wordLang, index + 1] : null,
    ([, pageId, translationId, wordLang, page]) =>
      getVersesByPage(pageId, translationId, page, 20, wordLang).catch((err) => {
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
  const selectedWordTranslationName = useMemo(
    () =>
      wordTranslationOptions.find((o) => o.id === settings.wordTranslationId)?.language_name ||
      t('select_word_translation'),
    [settings.wordTranslationId, wordTranslationOptions, t]
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
  const wordLanguageOptions = useMemo(() => {
    const filtered = wordTranslationOptions.filter((o) =>
      o.language_name.toLowerCase().includes(wordTranslationSearchTerm.toLowerCase())
    );
    const seen = new Set<string>();
    return filtered.reduce<LanguageOption[]>((acc, t) => {
      if (!seen.has(t.language_name)) {
        seen.add(t.language_name);
        acc.push({ language_name: t.language_name, id: t.id });
      }
      return acc;
    }, []);
  }, [wordTranslationOptions, wordTranslationSearchTerm]);

  return (
    <div className="flex flex-grow bg-[var(--background)] text-[var(--foreground)] font-sans overflow-hidden">
      <main className="flex-grow bg-[var(--background)] p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto relative">
          {/* Only render content when pageId is available */}
          {pageId ? (
            isLoading ? (
              <div className="text-center py-20 text-teal-600">{t('loading')}</div>
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
                        onEnded={() => setPlayingId(null)}
                        onError={() => {
                          setError(t('could_not_play_audio'));
                          setPlayingId(null);
                        }}
                      >
                        <track kind="captions" />
                      </audio>
                    )}
                  </React.Fragment>
                ))}
                <div ref={loadMoreRef} className="py-4 text-center">
                  {isValidating && <span className="text-teal-600">{t('loading')}</span>}
                  {isReachingEnd && <span className="text-gray-500">{t('end_of_page')}</span>}
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-gray-500">{t('no_verses_found_on_page')}</div>
            )
          ) : (
            // Optionally, show a loading or waiting message while pageId is not available
            <div className="text-center py-20 text-teal-600">{t('loading')}</div>
          )}
        </div>
      </main>

      <SettingsSidebar
        onTranslationPanelOpen={() => setIsTranslationPanelOpen(true)}
        onWordTranslationPanelOpen={() => setIsWordPanelOpen(true)}
        selectedTranslationName={selectedTranslationName}
        selectedWordTranslationName={selectedWordTranslationName}
      />

      <TranslationPanel
        isOpen={isTranslationPanelOpen}
        onClose={() => setIsTranslationPanelOpen(false)}
        groupedTranslations={groupedTranslations}
        searchTerm={translationSearchTerm}
        onSearchTermChange={setTranslationSearchTerm}
      />
      <WordTranslationPanel
        isOpen={isWordPanelOpen}
        onClose={() => setIsWordPanelOpen(false)}
        languages={wordLanguageOptions}
        searchTerm={wordTranslationSearchTerm}
        onSearchTermChange={setWordTranslationSearchTerm}
        onReset={() => {
          setWordTranslationSearchTerm('');
          setSettings({ ...settings, wordTranslationId: DEFAULT_WORD_TRANSLATION_ID });
        }}
      />
    </div>
  );
}
