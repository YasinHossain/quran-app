// app/surah/[surahId]/page.tsx
'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Verse } from './_components/Verse';
import { SettingsSidebar } from './_components/SettingsSidebar';
import { TranslationPanel } from './_components/TranslationPanel';
import { Verse as VerseType, TranslationResource } from '@/types';
import { getTranslations, getVersesByChapter } from '@/lib/api';
import { useSettings } from '@/app/context/SettingsContext';
import { useAudio } from '@/app/context/AudioContext';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

// --- Interfaces & Data ---

export default function SurahPage({ params }: { params: { surahId: string } }) {
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSettings();
  const { playingId, setPlayingId } = useAudio();
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [translationSearchTerm, setTranslationSearchTerm] = useState('');
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data: translationOptions } = useSWR('translations', getTranslations);

  const {
    data,
    size,
    setSize,
    isValidating
  } = useSWRInfinite(
    index =>
      params.surahId
        ? ['verses', params.surahId, settings.translationId, index + 1]
        : null,
    ([, surahId, translationId, page]) =>
      getVersesByChapter(surahId, translationId, page).catch(err => {
        setError(`Failed to load content. ${err.message}`);
        return { verses: [], totalPages: 1 };
      })
  );

  const verses = data ? data.flatMap(d => d.verses) : [];
  const totalPages = data ? data[data.length - 1]?.totalPages : 1;
  const isLoading = !data && !error;
  const isReachingEnd = size >= totalPages;

  // --- Infinite Scroll Effect ---
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(entries => {
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
      translationOptions?.find(o => o.id === settings.translationId)?.name ||
      'Select Translation',
    [settings.translationId, translationOptions]
  );
  const groupedTranslations = useMemo(
    () =>
      (translationOptions || [])
        .filter(o =>
          o.name.toLowerCase().includes(translationSearchTerm.toLowerCase())
        )
        .reduce<Record<string, TranslationResource[]>>((acc, t) => {
          (acc[t.language_name] ||= []).push(t);
          return acc;
        }, {}),
    [translationOptions, translationSearchTerm]
  );
  


  return (
    <div className="flex flex-grow bg-white font-sans overflow-hidden">
      <main className="flex-grow bg-[#F0FAF8] p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto relative">
          {isLoading ? (
            <div className="text-center py-20 text-teal-600">Loading Surah...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>
          ) : verses.length > 0 ? (
            <>
              {verses.map(v => (
                <React.Fragment key={v.id}>
                  <Verse verse={v} />
                  {playingId === v.id && v.audio?.url && (
                    <audio
                      src={`https://verses.quran.com/${v.audio.url}`}
                      autoPlay
                      onEnded={() => setPlayingId(null)}
                      onError={() => {
                        setError('Could not play audio.');
                        setPlayingId(null);
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
              <div ref={loadMoreRef} className="py-4 text-center">
                {isValidating && <span className="text-teal-600">Loading...</span>}
                {isReachingEnd && <span className="text-gray-500">End of Surah</span>}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-gray-500">No verses found.</div>
          )}
        </div>
      </main>

      <SettingsSidebar
        onTranslationPanelOpen={() => setIsTranslationPanelOpen(true)}
        selectedTranslationName={selectedTranslationName}
      />
      
      <TranslationPanel
        isOpen={isTranslationPanelOpen}
        onClose={() => setIsTranslationPanelOpen(false)}
        groupedTranslations={groupedTranslations}
        searchTerm={translationSearchTerm}
        onSearchTermChange={setTranslationSearchTerm}
      />
    </div>
  );
}
