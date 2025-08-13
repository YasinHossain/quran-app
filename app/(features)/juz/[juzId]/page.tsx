// app/(features)/juz/[juzId]/page.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsSidebar } from '@/app/(features)/surah/[surahId]/components/SettingsSidebar';
import { TranslationPanel } from '@/app/(features)/surah/[surahId]/components/TranslationPanel';
import { WordLanguagePanel } from '@/app/(features)/surah/[surahId]/components/WordLanguagePanel';
import { LANGUAGE_CODES } from '@/lib/text/languageCodes';
import type { LanguageCode } from '@/lib/text/languageCodes';
import { buildAudioUrl } from '@/lib/audio/reciters';
import { QuranAudioPlayer } from '@/app/shared/player';
import type { TranslationResource } from '@/types';
import { getSurahCoverUrl } from '@/lib/api';
import useJuzData from '../hooks/useJuzData';
import { JuzHeader } from './components/JuzHeader';
import { JuzVerseList } from './components/JuzVerseList';

const DEFAULT_WORD_TRANSLATION_ID = 85;

export default function JuzPage({
  params,
}: {
  params: Promise<{ juzId: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { juzId } = React.use(params);

  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [translationSearchTerm, setTranslationSearchTerm] = useState('');
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);
  const [wordTranslationSearchTerm, setWordTranslationSearchTerm] = useState('');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const { t } = useTranslation();

  const {
    juz,
    juzError,
    isLoading,
    error,
    verses,
    isValidating,
    isReachingEnd,
    loadMoreRef,
    translationOptions,
    wordLanguageOptions,
    wordLanguageMap,
    settings,
    setSettings,
    activeVerse,
    reciter,
    isPlayerVisible,
    handleNext,
    handlePrev,
  } = useJuzData(juzId);

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

  useEffect(() => {
    if (activeVerse) {
      const surahNumber = parseInt(activeVerse.verse_key.split(':')[0], 10);
      getSurahCoverUrl(surahNumber).then(setCoverUrl);
    }
  }, [activeVerse]);

  const track = activeVerse
    ? {
        id: activeVerse.id.toString(),
        title: `Verse ${activeVerse.verse_key}`,
        artist: reciter.name,
        coverUrl: coverUrl || '',
        durationSec: 0,
        src: buildAudioUrl(activeVerse.verse_key, reciter.path),
      }
    : null;

  return (
    <div className="flex flex-grow bg-white dark:bg-[var(--background)] text-[var(--foreground)] font-sans overflow-hidden min-h-0">
      <main className="flex-grow bg-white dark:bg-[var(--background)] p-6 lg:p-10 overflow-y-auto homepage-scrollable-area">
        <div className="w-full relative">
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
                <JuzHeader juz={juz} />
                <JuzVerseList
                  verses={verses}
                  loadMoreRef={loadMoreRef}
                  isValidating={isValidating}
                  isReachingEnd={isReachingEnd}
                />
              </>
            )
          ) : (
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
      {activeVerse && isPlayerVisible && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent z-50">
          <QuranAudioPlayer track={track} onNext={handleNext} onPrev={handlePrev} />
        </div>
      )}
    </div>
  );
}
