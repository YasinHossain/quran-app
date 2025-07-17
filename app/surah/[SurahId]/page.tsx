// app/surah/[surahId]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import {
  FaPlay,
  FaBookmark,
  FaBookOpen,
  FaCog,
  FaFont,
  FaChevronDown,
  FaEllipsisH,
  FaSearch,
  FaArrowLeft,
} from 'react-icons/fa';

interface TranslationResource {
  id: number;
  name: string;
  language_name: string;
}

interface Settings {
  translationId: number;
  arabicFontSize: number;
  translationFontSize: number;
  arabicFontFace: string;
}

export default function SurahPage() {
  const params = useParams();
  // Add debugging and ensure we get the surahId properly
  const surahId = params?.surahId as string;
  
  console.log('Params:', params);
  console.log('SurahId:', surahId);
  
  const [verses, setVerses] = useState<any[]>([]);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [translationOptions, setTranslationOptions] = useState<TranslationResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>({
    translationId: 0,
    arabicFontSize: 24,
    translationFontSize: 16,
    arabicFontFace: 'serif',
  });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Load translations
  useEffect(() => {
    fetch('https://api.quran.com/api/v4/resources/translations')
      .then(res => res.json())
      .then(json => setTranslationOptions(json.translations))
      .catch(err => {
        console.error('Translations load error:', err);
        setError('Failed to load translations');
      });
  }, []);

  // 2. Default to first translation when available
  useEffect(() => {
    if (translationOptions.length > 0 && settings.translationId === 0) {
      setSettings(s => ({ ...s, translationId: translationOptions[0].id }));
    }
  }, [translationOptions, settings.translationId]);

  // 3. Fetch verses whenever surahId & translationId are ready
  useEffect(() => {
    if (!surahId || settings.translationId === 0) {
      console.log('Not fetching verses - surahId:', surahId, 'translationId:', settings.translationId);
      return;
    }

    console.log('Fetching verses for surah:', surahId, 'translation:', settings.translationId);
    setIsLoading(true);
    setError(null);
    
    const url =
      `https://api.quran.com/api/v4/verses/by_chapter/${surahId}` +
      `?language=en` +
      `&words=true` +
      `&translations=${settings.translationId}` +
      `&fields=text_uthmani,text_imlaei` +
      `&translation_fields=text` +
      `&audio=7` +
      `&audio_fields=url` +
      `&per_page=50` +
      `&page=1`;

    console.log('Fetching URL:', url);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        console.log('API Response:', json);
        setVerses(json.verses || []);
      })
      .catch(err => {
        console.error('Verses load error:', err);
        setError(`Failed to load verses: ${err.message}`);
        setVerses([]);
      })
      .finally(() => setIsLoading(false));
  }, [surahId, settings.translationId]);

  // Helpers
  const selectedTranslationName = useMemo(
    () =>
      translationOptions.find(o => o.id === settings.translationId)?.name ||
      'Select Translation',
    [settings.translationId, translationOptions]
  );

  const groupedTranslations = useMemo(() => {
    return translationOptions
      .filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .reduce<Record<string, TranslationResource[]>>((acc, t) => {
        (acc[t.language_name] ||= []).push(t);
        return acc;
      }, {});
  }, [translationOptions, searchTerm]);

  const sortedLanguageKeys = useMemo(() => {
    const priority = ['English', 'Bangla'];
    return Object.keys(groupedTranslations).sort((a, b) => {
      const ai = priority.indexOf(a);
      const bi = priority.indexOf(b);
      if (ai !== -1 || bi !== -1) return ai - bi;
      return a.localeCompare(b);
    });
  }, [groupedTranslations]);

  // Debug info
  if (!surahId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please select a Surah.</p>
          <div className="text-xs text-gray-400">
            <p>Debug info:</p>
            <p>Params: {JSON.stringify(params)}</p>
            <p>SurahId: {surahId || 'undefined'}</p>
            <p>URL: {typeof window !== 'undefined' ? window.location.href : 'SSR'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-white min-h-screen font-sans">
      <main className="flex-grow bg-[#F5FBF8] p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          {/* Debug info */}
          <div className="mb-4 p-2 bg-gray-100 text-xs rounded">
            <p>Surah ID: {surahId}</p>
            <p>Translation ID: {settings.translationId}</p>
            <p>Verses count: {verses.length}</p>
            <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
            {error && <p className="text-red-600">Error: {error}</p>}
          </div>

          {isLoading ? (
            <div className="text-center py-10">Loading verses…</div>
          ) : error ? (
            <div className="text-center py-10 text-red-600">{error}</div>
          ) : verses.length > 0 ? (
            verses.map(v => (
              <div key={v.id} className="flex items-start gap-x-6 mb-12">
                <div className="w-16 text-center pt-1 space-y-2">
                  <p className="font-semibold text-teal-600 text-sm">
                    {v.verse_key}
                  </p>
                  <div className="flex flex-col items-center space-y-1 text-gray-400">
                    <button
                      onClick={() => setPlayingId(v.id)}
                      title="Play"
                      className="p-1.5 rounded-full hover:bg-gray-100 hover:text-teal-600 transition"
                    >
                      <FaPlay size={18} />
                    </button>
                    <button
                      title="Bookmark"
                      className="p-1.5 rounded-full hover:bg-gray-100 hover:text-teal-600 transition"
                    >
                      <FaBookmark size={18} />
                    </button>
                    <button
                      title="Tafsir"
                      className="p-1.5 rounded-full hover:bg-gray-100 hover:text-teal-600 transition"
                    >
                      <FaBookOpen size={18} />
                    </button>
                    <button
                      title="More"
                      className="p-1.5 rounded-full hover:bg-gray-100 hover:text-teal-600 transition"
                    >
                      <FaEllipsisH size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex-grow space-y-4">
                  <p
                    className="text-right leading-relaxed"
                    style={{
                      fontFamily: settings.arabicFontFace,
                      fontSize: `${settings.arabicFontSize}px`,
                    }}
                  >
                    {v.text_uthmani}
                  </p>
                  {v.translations?.map((t: any) => (
                    <div key={t.resource_id}>
                      <p className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
                        {t.resource_name}
                      </p>
                      <p
                        className="text-left leading-relaxed"
                        style={{ fontSize: `${settings.translationFontSize}px` }}
                      >
                        {t.text.replace(/<[^>]*>?/gm, '')}
                      </p>
                    </div>
                  ))}
                </div>

                {playingId === v.id && (
                  <audio
                    src={v.audio?.url}
                    autoPlay
                    onEnded={() => setPlayingId(null)}
                  />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              No verses found or an error occurred.
            </div>
          )}
        </div>
      </main>

      <aside className="w-80 bg-[#EAF3F2] p-6 border-l border-gray-200 space-y-6">
        <h2 className="text-xl font-bold">Settings</h2>

        <details open className="space-y-4">
          <summary className="flex items-center justify-between p-2 rounded hover:bg-gray-200/70 cursor-pointer">
            <div className="flex items-center space-x-2">
              <FaCog size={20} className="text-teal-700" />
              <span className="font-semibold">Reading</span>
            </div>
            <FaChevronDown size={20} className="text-gray-500" />
          </summary>
          <div className="px-2">
            <label className="block mb-1 text-sm font-medium">Translation</label>
            <button
              onClick={() => setIsPanelOpen(true)}
              className="w-full bg-white border rounded p-2 text-left truncate"
            >
              {selectedTranslationName}
            </button>
          </div>
        </details>

        <details open className="space-y-4">
          <summary className="flex items-center justify-between p-2 rounded hover:bg-gray-200/70 cursor-pointer">
            <div className="flex items-center space-x-2">
              <FaFont size={20} className="text-teal-700" />
              <span className="font-semibold">Font</span>
            </div>
            <FaChevronDown size={20} className="text-gray-500" />
          </summary>
          <div className="px-2 space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm">Arabic Size</label>
                <span className="font-semibold text-teal-700">
                  {settings.arabicFontSize}
                </span>
              </div>
              <input
                type="range"
                min="16"
                max="40"
                value={settings.arabicFontSize}
                onChange={e =>
                  setSettings(s => ({ ...s, arabicFontSize: +e.target.value }))
                }
                className="w-full"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm">Trans. Size</label>
                <span className="font-semibold text-teal-700">
                  {settings.translationFontSize}
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="24"
                value={settings.translationFontSize}
                onChange={e =>
                  setSettings(s => ({
                    ...s,
                    translationFontSize: +e.target.value,
                  }))
                }
                className="w-full"
              />
            </div>
          </div>
        </details>
      </aside>

      {/* Translation panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[#EAF3F2] shadow z-50 transform transition-transform ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <button onClick={() => setIsPanelOpen(false)}>
              <FaArrowLeft size={20} />
            </button>
            <h2 className="font-bold">Translations</h2>
            <button onClick={() => setSearchTerm('')} className="text-sm text-teal-700">
              Reset
            </button>
          </div>
          <div className="p-4 border-b">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search translators"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded"
              />
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            {sortedLanguageKeys.map(lang => (
              <div key={lang}>
                <h3 className="sticky top-0 bg-teal-100 px-4 py-2 font-bold">
                  {lang}
                </h3>
                <div className="p-4 space-y-2">
                  {groupedTranslations[lang].map(opt => (
                    <label key={opt.id} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="translation"
                        checked={settings.translationId === opt.id}
                        onChange={() => {
                          setSettings(s => ({ ...s, translationId: opt.id }));
                          setIsPanelOpen(false);
                        }}
                      />
                      <span>{opt.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isPanelOpen && (
        <div
          onClick={() => setIsPanelOpen(false)}
          className="fixed inset-0 bg-black/20 z-40"
        />
      )}
    </div>
  );
}