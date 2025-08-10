// app/features/juz/[juzId]/page.tsx
'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Verse } from '@/app/features/surah/[surahId]/components/Verse';
import { SettingsSidebar } from '@/app/features/surah/[surahId]/components/SettingsSidebar';
import { TranslationPanel } from '@/app/features/surah/[surahId]/components/TranslationPanel';
import { WordLanguagePanel } from '@/app/features/surah/[surahId]/components/WordLanguagePanel';
import { Verse as VerseType } from '@/types';
import type { TranslationResource, Juz } from '@/lib/api';
import { getTranslations, getWordTranslations, getVersesByJuz, getJuz } from '@/lib/api';
import { LANGUAGE_CODES } from '@/lib/text/languageCodes';
import type { LanguageCode } from '@/lib/text/languageCodes';
import { WORD_LANGUAGE_LABELS } from '@/lib/text/wordLanguages';
import { useSettings } from '@/app/providers/SettingsContext';
import { useAudio } from '@/app/features/player/context/AudioContext';
import { buildAudioUrl } from '@/lib/audio/reciters';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

const DEFAULT_WORD_TRANSLATION_ID = 85;

export default function JuzPage({
  params,
}: {
  params: Promise<{ juzId: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { juzId } = React.use(params);

  const [error, setError] = useState<string | null>(null);
  const { settings, setSettings } = useSettings();
  const { t } = useTranslation();
  const { playingId, setPlayingId, reciter } = useAudio();
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [translationSearchTerm, setTranslationSearchTerm] = useState('');
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);
  const [wordTranslationSearchTerm, setWordTranslationSearchTerm] = useState('');

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Fetch Juz information using juzId
  const { data: juzData, error: juzError } = useSWR(juzId ? ['juz', juzId] : null, ([, id]) =>
    getJuz(id)
  );
  const juz: Juz | undefined = juzData;

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

  // Infinite loading for verses
  const { data, size, setSize, isValidating } = useSWRInfinite(
    (index) =>
      juzId ? ['verses', juzId, settings.translationId, settings.wordLang, index + 1] : null,
    ([, juzId, translationId, wordLang, page]) =>
      getVersesByJuz(juzId, translationId, page, 20, wordLang).catch((err) => {
        setError(`Failed to load content. ${err.message}`);
        return { verses: [], totalPages: 1 };
      })
  );

  const verses: VerseType[] = data ? data.flatMap((d) => d.verses) : [];
  const totalPages = data ? data[data.length - 1]?.totalPages : 1;
  const isLoading = !data && !error && !juzData && !juzError;
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

  return (
    <div className="flex flex-grow bg-white dark:bg-[var(--background)] text-[var(--foreground)] font-sans overflow-hidden min-h-0">
      <main className="flex-grow bg-white dark:bg-[var(--background)] p-6 lg:p-10 overflow-y-auto homepage-scrollable-area">
        <div className="w-full relative">
          {/* Only render content when juzId is available */}
          {juzId ? (
            isLoading ? (
              <div className="text-center py-20 text-teal-600">{t('loading')}</div>
            ) : error ? (
              <div className="text-center py-20 text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>
            ) : juzError ? (
              <div className="text-center py-20 text-red-600 bg-red-50 p-4 rounded-lg">
                {t('failed_to_load_juz_info')}
              </div>
            ) : (
              <>
                {/* Display Juz information */}
                {juz && (
                  <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[var(--foreground)]">
                      {t('juz_number', { number: juz.juz_number })}
                    </h1>
                  </div>
                )}

                {/* Tab Content */}
                {verses.length > 0 ? (
                  <>
                    {verses.map((v) => (
                      <React.Fragment key={v.id}>
                        <Verse verse={v} />
                        {playingId === v.id && (
                          <audio
                            src={buildAudioUrl(v.verse_key, reciter.path)}
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
                      {isReachingEnd && <span className="text-gray-500">{t('end_of_juz')}</span>}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20 text-gray-500">
                    {t('no_verses_found_in_juz')}
                  </div>
                )}
              </>
            )
          ) : (
            // Optionally, show a loading or waiting message while juzId is not available
            <div className="text-center py-20 text-teal-600">{t('loading')}</div>
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
    </div>
  );
}
