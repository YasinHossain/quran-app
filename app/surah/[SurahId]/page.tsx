// app/surah/[surahId]/page.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Verse } from './_components/Verse';
import { SettingsSidebar } from './_components/SettingsSidebar';
import { TranslationPanel } from './_components/TranslationPanel';
import { Verse as VerseType, TranslationResource } from '@/types';
import { getTranslations, getVersesByChapter } from '@/lib/api';
import { useSettings } from '@/app/context/SettingsContext';
import { useAudio } from '@/app/context/AudioContext';

// --- Interfaces & Data ---

export default function SurahPage({ params }: { params: { surahId: string } }) {
  const [verses, setVerses] = useState<VerseType[]>([]);
  const [translationOptions, setTranslationOptions] = useState<TranslationResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSettings();
  const { playingId, setPlayingId } = useAudio();
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [translationSearchTerm, setTranslationSearchTerm] = useState('');

  // --- Data Fetching Effect ---
  useEffect(() => {
    // Fetch all available translations once
    getTranslations()
      .then(setTranslationOptions)
      .catch(err => console.error('Translations load error:', err));
  }, []);
  
  useEffect(() => {
    if (!params.surahId) return;
    setIsLoading(true);
    getVersesByChapter(params.surahId, settings.translationId)
      .then(vs => {
        setVerses(vs);
        setError(null);
      })
      .catch(err => {
        console.error('Verses load error:', err);
        setError(`Failed to load content. ${err.message}`);
        setVerses([]);
      })
      .finally(() => setIsLoading(false));
      
  }, [params.surahId, settings.translationId]);

  // --- Memoized Values ---
  const selectedTranslationName = useMemo(() => translationOptions.find(o => o.id === settings.translationId)?.name || 'Select Translation', [settings.translationId, translationOptions]);
  const groupedTranslations = useMemo(() => translationOptions.filter(o => o.name.toLowerCase().includes(translationSearchTerm.toLowerCase())).reduce<Record<string, TranslationResource[]>>((acc, t) => { (acc[t.language_name] ||= []).push(t); return acc; }, {}), [translationOptions, translationSearchTerm]);
  


  return (
    <div className="flex flex-grow bg-white font-sans overflow-hidden">
      <main className="flex-grow bg-[#F0FAF8] p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto relative">
          {isLoading ? (
            <div className="text-center py-20 text-teal-600">Loading Surah...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>
          ) : verses.length > 0 ? (
            verses.map(v => (
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
            ))
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
