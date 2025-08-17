// app/(features)/juz/[juzId]/page.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsSidebar } from '@/app/(features)/surah/[surahId]/components/SettingsSidebar';
import { LANGUAGE_CODES } from '@/lib/text/languageCodes';
import type { LanguageCode } from '@/lib/text/languageCodes';
import { buildAudioUrl } from '@/lib/audio/reciters';
import { QuranAudioPlayer } from '@/app/shared/player';
import { getSurahCoverUrl } from '@/lib/api';
import useJuzData from '../hooks/useJuzData';
import { JuzHeader } from './components/JuzHeader';
import { JuzVerseList } from './components/JuzVerseList';

const DEFAULT_WORD_TRANSLATION_ID = 85;

export default function JuzPage({ params }: { params: Promise<{ juzId: string }> }) {
  const { juzId } = React.use(params);

  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);
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
    <div className="flex flex-grow bg-background text-foreground font-sans overflow-hidden min-h-0">
      <main className="flex-grow bg-background p-6 lg:p-10 overflow-y-auto homepage-scrollable-area">
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
        isTranslationPanelOpen={isTranslationPanelOpen}
        onTranslationPanelClose={() => setIsTranslationPanelOpen(false)}
        isWordLanguagePanelOpen={isWordPanelOpen}
        onWordLanguagePanelClose={() => setIsWordPanelOpen(false)}
      />
      {activeVerse && isPlayerVisible && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent z-50">
          <QuranAudioPlayer track={track} onNext={handleNext} onPrev={handlePrev} />
        </div>
      )}
    </div>
  );
}
