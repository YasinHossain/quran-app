'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsSidebar } from '@/app/(features)/surah/[surahId]/components/SettingsSidebar';
import { LANGUAGE_CODES } from '@/lib/text/languageCodes';
import type { LanguageCode } from '@/lib/text/languageCodes';
import { buildAudioUrl } from '@/lib/audio/reciters';
import { QuranAudioPlayer } from '@/app/shared/player';
import { getSurahCoverUrl } from '@/lib/api';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import useJuzData from '../hooks/useJuzData';
import { JuzHeader } from './components/JuzHeader';
import { JuzVerseList } from './components/JuzVerseList';

export default function JuzClient({ juzId }: { juzId: string }) {
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const { t } = useTranslation();
  const { isHidden } = useHeaderVisibility();

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
    settings,
    activeVerse,
    reciter,
    isPlayerVisible,
    handleNext,
    handlePrev,
  } = useJuzData(juzId);

  const selectedTranslationName = useMemo(
    () =>
      settings
        ? translationOptions.find((o) => o.id === settings.translationId)?.name ||
          t('select_translation')
        : t('select_translation'),
    [settings?.translationId, translationOptions, t]
  );

  const selectedWordLanguageName = useMemo(
    () =>
      settings
        ? wordLanguageOptions.find(
            (o) =>
              (LANGUAGE_CODES as Record<string, LanguageCode>)[o.name.toLowerCase()] ===
              settings.wordLang
          )?.name || t('select_word_translation')
        : t('select_word_translation'),
    [settings?.wordLang, wordLanguageOptions, t]
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
    <div className="flex flex-grow bg-surface text-foreground font-sans overflow-hidden min-h-0">
      <main
        className={`flex-grow bg-surface overflow-y-auto homepage-scrollable-area transition-all duration-300 ${
          isHidden
            ? 'pt-6 lg:pt-10'
            : 'pt-[calc(3.5rem+1.5rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+1.5rem+env(safe-area-inset-top))] lg:pt-[calc(4rem+2.5rem+env(safe-area-inset-top))]'
        } px-6 lg:px-10 pb-6 lg:pb-10`}
      >
        <div className="w-full relative">
          {juzId ? (
            isLoading ? (
              <div className="text-center py-20 text-accent">{t('loading')}</div>
            ) : error ? (
              <div className="text-center py-20 text-status-error bg-surface p-4 rounded-lg">
                {error}
              </div>
            ) : juzError ? (
              <div className="text-center py-20 text-status-error bg-surface p-4 rounded-lg">
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
            <div className="text-center py-20 text-accent">{t('loading')}</div>
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
        <div
          className={`fixed left-0 right-0 p-4 bg-transparent z-audio-player transition-all duration-300 ease-in-out ${
            isHidden ? 'bottom-0 pb-safe' : 'bottom-0 pb-safe lg:pb-4'
          } lg:left-1/2 lg:-translate-x-1/2 lg:right-auto lg:w-[min(90vw,60rem)]`}
          style={{
            bottom: isHidden
              ? 'env(safe-area-inset-bottom)'
              : 'calc(5rem + env(safe-area-inset-bottom))',
          }}
        >
          {track && <QuranAudioPlayer track={track} onNext={handleNext} onPrev={handlePrev} />}
        </div>
      )}
    </div>
  );
}
