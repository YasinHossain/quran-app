'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Verse } from '@/app/(features)/surah/[surahId]/components/Verse';
import { SettingsSidebar } from '@/app/(features)/surah/[surahId]/components/SettingsSidebar';
import { Verse as VerseType } from '@/types';
import { getVersesByPage, getSurahCoverUrl } from '@/lib/api';
import { LANGUAGE_CODES } from '@/lib/text/languageCodes';
import type { LanguageCode } from '@/lib/text/languageCodes';
import Spinner from '@/app/shared/Spinner';
import { QuranAudioPlayer } from '@/app/shared/player';
import { buildAudioUrl } from '@/lib/audio/reciters';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import useVerseListing from '@/app/(features)/surah/hooks/useVerseListing';

interface PagePageProps {
  params: Promise<{ pageId: string }>;
}

export default function PagePage({ params }: PagePageProps) {
  const { pageId } = React.use(params);
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const { t } = useTranslation();
  const { isHidden } = useHeaderVisibility();

  const {
    error,
    isLoading,
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
    <div className="flex flex-grow bg-surface text-foreground font-sans overflow-hidden">
      <main
        className={`flex-grow bg-surface overflow-y-auto homepage-scrollable-area transition-all duration-300 ${
          isHidden
            ? 'pt-6 lg:pt-10'
            : 'pt-[calc(3.5rem+1.5rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+1.5rem+env(safe-area-inset-top))] lg:pt-[calc(4rem+2.5rem+env(safe-area-inset-top))]'
        } px-6 lg:px-10 pb-6 lg:pb-10`}
      >
        <div className="w-full relative">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner className="h-8 w-8 text-accent" />
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
                {isValidating && <Spinner className="inline h-5 w-5 text-accent" />}
                {isReachingEnd && <span className="text-muted">{t('end_of_page')}</span>}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-muted">{t('no_verses_found_on_page')}</div>
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
          <QuranAudioPlayer track={track} onNext={handleNext} onPrev={handlePrev} />
        </div>
      )}
    </div>
  );
}
