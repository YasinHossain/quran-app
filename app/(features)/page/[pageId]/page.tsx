'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Verse } from '@/app/(features)/surah/[surahId]/components/Verse';
import { SettingsSidebar } from '@/app/(features)/surah/[surahId]/components/SettingsSidebar';
import { TranslationPanel } from '@/app/(features)/surah/[surahId]/components/TranslationPanel';
import { WordLanguagePanel } from '@/app/(features)/surah/[surahId]/components/WordLanguagePanel';
import { Verse as VerseType, TranslationResource } from '@/types';
import { getVersesByPage, getSurahCoverUrl } from '@/lib/api';
import { LANGUAGE_CODES } from '@/lib/text/languageCodes';
import type { LanguageCode } from '@/lib/text/languageCodes';
import Spinner from '@/app/shared/Spinner';
import { QuranAudioPlayer } from '@/app/shared/player';
import { buildAudioUrl } from '@/lib/audio/reciters';
import useVerseListing from '@/app/(features)/surah/hooks/useVerseListing';

const DEFAULT_WORD_TRANSLATION_ID = 85;

interface PagePageProps {
  params: Promise<{ pageId: string }>;
}

export default function PagePage({ params }: PagePageProps) {
  const { pageId } = React.use(params);
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [translationSearchTerm, setTranslationSearchTerm] = useState('');
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);
  const [wordTranslationSearchTerm, setWordTranslationSearchTerm] = useState('');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const { t } = useTranslation();

  const {
    error,
    isLoading,
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
  } = useVerseListing({ id: pageId, lookup: getVersesByPage });

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
              {verses.map((v: VerseType) => (
                <React.Fragment key={v.id}>
                  <Verse verse={v} />
                </React.Fragment>
              ))}
              <div ref={loadMoreRef} className="py-4 text-center space-x-2">
                {isValidating && <Spinner className="inline h-5 w-5 text-teal-600" />}
                {isReachingEnd && <span className="text-gray-500">{t('end_of_page')}</span>}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-gray-500">{t('no_verses_found_on_page')}</div>
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
