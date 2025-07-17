// app/surah/[surahId]/page.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Verse } from './_components/Verse';
import { SettingsSidebar } from './_components/SettingsSidebar';
import { TranslationPanel } from './_components/TranslationPanel';

// --- Interfaces & Data ---
interface TranslationResource { id: number; name: string; language_name: string; }
interface Settings { translationId: number; arabicFontSize: number; translationFontSize: number; arabicFontFace: string; }
const arabicFonts = [
    { name: 'KFGQ', value: '"KFGQPC Uthman Taha Naskh", serif' },
    { name: 'Me Quran', value: '"Me Quran", sans-serif' },
    { name: 'Al Mushaf', value: '"Al Mushaf", serif' },
];

export default function SurahPage({ params }: { params: { surahId: string } }) {
  const [verses, setVerses] = useState<any[]>([]);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [translationOptions, setTranslationOptions] = useState<TranslationResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>({
    translationId: 20, // Sahih International
    arabicFontSize: 28,
    translationFontSize: 16,
    arabicFontFace: arabicFonts[0].value,
  });
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [translationSearchTerm, setTranslationSearchTerm] = useState('');

  // --- Data Fetching Effect ---
  useEffect(() => {
    // Fetch all available translations once
    fetch('https://api.quran.com/api/v4/resources/translations')
      .then(res => res.json())
      .then(json => setTranslationOptions(json.translations || []))
      .catch(err => console.error('Translations load error:', err));
  }, []);
  
  useEffect(() => {
    if (!params.surahId) return;
    setIsLoading(true);
    const url = `https://api.quran.com/api/v4/verses/by_chapter/${params.surahId}?language=en&words=true&translations=${settings.translationId}&fields=text_uthmani,audio&per_page=300`;
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(json => {
        setVerses(json.verses || []);
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
  
  // --- Handlers ---
  const handlePlayToggle = (id: number) => {
    setPlayingId(currentId => (currentId === id ? null : id));
  };

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
                <Verse
                  verse={v}
                  playingId={playingId}
                  onPlayToggle={handlePlayToggle}
                  arabicFontFace={settings.arabicFontFace}
                  arabicFontSize={settings.arabicFontSize}
                  translationFontSize={settings.translationFontSize}
                />
                {playingId === v.id && v.audio?.url && (
                  <audio src={`https://verses.quran.com/${v.audio.url}`} autoPlay onEnded={() => setPlayingId(null)} onError={() => { setError("Could not play audio."); setPlayingId(null); }} />
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="text-center py-20 text-gray-500">No verses found.</div>
          )}
        </div>
      </main>

      <SettingsSidebar
        settings={settings}
        onSettingsChange={setSettings}
        onTranslationPanelOpen={() => setIsTranslationPanelOpen(true)}
        selectedTranslationName={selectedTranslationName}
        arabicFonts={arabicFonts}
      />
      
      <TranslationPanel
        isOpen={isTranslationPanelOpen}
        onClose={() => setIsTranslationPanelOpen(false)}
        groupedTranslations={groupedTranslations}
        searchTerm={translationSearchTerm}
        onSearchTermChange={setTranslationSearchTerm}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
}
