// app/surah/[surahId]/page.tsx
'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';

// --- SVG Icons ---
const FaPlay = ({ size = 18, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 448 512" fill="currentColor"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/></svg>;
const FaPause = ({ size = 18, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 448 512" fill="currentColor"><path d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"/></svg>;
const FaBookmark = ({ size = 18, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 384 512" fill="currentColor"><path d="M0 512V48C0 21.5 21.5 0 48 0h288c26.5 0 48 21.5 48 48v464L192 400 0 512z"/></svg>;
const FaBookReader = ({ size = 18, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const FaFontSetting = ({ size = 20, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>;
const FaChevronDown = ({ size = 16, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const FaEllipsisH = ({ size = 18, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 512 512" fill="currentColor"><path d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"/></svg>;
const FaSearch = ({ size = 18, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 512 512" fill="currentColor"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"/></svg>;
const FaArrowLeft = ({ size = 20, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 448 512" fill="currentColor"><path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"/></svg>;

// --- Interfaces ---
interface TranslationResource { id: number; name: string; language_name: string; }
interface Settings { translationId: number; arabicFontSize: number; translationFontSize: number; arabicFontFace: string; }

const arabicFonts = [
    { name: 'KFGQ', value: '"KFGQPC Uthman Taha Naskh", serif' },
    { name: 'Me Quran', value: '"Me Quran", sans-serif' },
    { name: 'Al Mushaf', value: '"Al Mushaf", serif' },
    { name: 'Lateef', value: '"Lateef", serif' },
    { name: 'Scheherazade', value: '"Scheherazade New", serif' },
];

// --- Collapsible Section Component with Animation ---
const CollapsibleSection = ({ title, icon, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border-b border-gray-200/80">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 text-left">
                <div className="flex items-center space-x-3">
                    {icon}
                    <span className="font-semibold text-gray-800">{title}</span>
                </div>
                <FaChevronDown size={16} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="p-4 pt-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function SurahPage() {
  const [surahId, setSurahId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      const id = pathParts[pathParts.length - 1];
      if (id && !isNaN(Number(id))) setSurahId(id);
    }
  }, []);

  const [verses, setVerses] = useState<any[]>([]);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [translationOptions, setTranslationOptions] = useState<TranslationResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingTranslation, setIsChangingTranslation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>({
    translationId: 20,
    arabicFontSize: 26,
    translationFontSize: 16,
    arabicFontFace: arabicFonts[0].value,
  });
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const isInitialMount = useRef(true);

  // Lock body scroll when translation panel is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isTranslationPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalStyle;
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isTranslationPanelOpen]);


  useEffect(() => {
    fetch('https://api.quran.com/api/v4/resources/translations')
      .then(res => res.json())
      .then(json => setTranslationOptions(json.translations))
      .catch(err => {
        console.error('Translations load error:', err);
        setError('Failed to load translations');
      });
  }, []);

  // Effect for fetching verse data (runs on surahId change)
  useEffect(() => {
    if (!surahId) return;
    setIsLoading(true);
    const url = `https://api.quran.com/api/v4/verses/by_chapter/${surahId}?language=en&words=true&translations=${settings.translationId}&fields=text_uthmani,audio&per_page=286`;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => setVerses(json.verses || []))
      .catch(err => {
        console.error('Verses load error:', err);
        setError(`Failed to load verses: ${err.message}`);
        setVerses([]);
      })
      .finally(() => setIsLoading(false));
  }, [surahId]);

  // Effect for changing translation (runs on translationId change, skipping initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
    if (!surahId) return;

    setIsChangingTranslation(true);
    const url = `https://api.quran.com/api/v4/verses/by_chapter/${surahId}?language=en&words=true&translations=${settings.translationId}&fields=text_uthmani,audio&per_page=286`;
    fetch(url)
      .then(res => res.json())
      .then(json => setVerses(json.verses || []))
      .catch(err => {
        console.error('Translation change error:', err);
        setError('Failed to update translation.');
      })
      .finally(() => setIsChangingTranslation(false));
  }, [settings.translationId]);

  const selectedTranslationName = useMemo(() => translationOptions.find(o => o.id === settings.translationId)?.name || 'Select Translation', [settings.translationId, translationOptions]);
  const groupedTranslations = useMemo(() => translationOptions.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase())).reduce<Record<string, TranslationResource[]>>((acc, t) => { (acc[t.language_name] ||= []).push(t); return acc; }, {}), [translationOptions, searchTerm]);
  const sortedLanguageKeys = useMemo(() => { const p = ['English', 'Bangla']; return Object.keys(groupedTranslations).sort((a, b) => { const ai = p.indexOf(a), bi = p.indexOf(b); if (ai !== -1 || bi !== -1) return ai - bi; return a.localeCompare(b); }); }, [groupedTranslations]);

  if (!surahId) {
    return <div className="flex items-center justify-center h-screen bg-gray-50"><p className="text-gray-600">Please select a Surah.</p></div>;
  }

  return (
    <div className="flex bg-white h-screen font-sans">
      <main className="flex-grow bg-gray-50 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto relative">
          {isChangingTranslation && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                <p className="text-teal-600 font-semibold">Changing translation...</p>
            </div>
          )}
          {isLoading ? <div className="text-center py-20 text-teal-600">Loading...</div> : error ? <div className="text-center py-20 text-red-600 bg-red-50 p-4 rounded-lg">{error}</div> : verses.length > 0 ? (
            verses.map(v => (
              <div key={v.id} className="flex items-start gap-x-6 mb-12 border-b pb-8 border-gray-200">
                <div className="w-16 text-center pt-1 space-y-2 flex-shrink-0">
                  <p className="font-semibold text-teal-600 text-sm">{v.verse_key}</p>
                  <div className="flex flex-col items-center space-y-1 text-gray-400">
                    <button onClick={() => setPlayingId(playingId === v.id ? null : v.id)} title="Play/Pause" className={`p-1.5 rounded-full hover:bg-gray-100 transition ${playingId === v.id ? 'text-teal-600' : 'hover:text-teal-600'}`}>
                        {playingId === v.id ? <FaPause size={18} /> : <FaPlay size={18} />}
                    </button>
                    <button title="Bookmark" className="p-1.5 rounded-full hover:bg-gray-100 hover:text-teal-600 transition"><FaBookmark size={18} /></button>
                    <button title="Tafsir" className="p-1.5 rounded-full hover:bg-gray-100 hover:text-teal-600 transition"><FaBookReader size={18} /></button>
                    <button title="More" className="p-1.5 rounded-full hover:bg-gray-100 hover:text-teal-600 transition"><FaEllipsisH size={18} /></button>
                  </div>
                </div>
                <div className="flex-grow space-y-6">
                  <p className="text-right leading-loose text-gray-800" style={{ fontFamily: settings.arabicFontFace, fontSize: `${settings.arabicFontSize}px` }}>{v.text_uthmani}</p>
                  {v.translations?.map((t: any) => (<div key={t.resource_id}><p className="text-left leading-relaxed text-gray-600" style={{ fontSize: `${settings.translationFontSize}px` }} dangerouslySetInnerHTML={{ __html: t.text }}/></div>))}
                </div>
                {playingId === v.id && v.audio?.url && (<audio src={`https://verses.quran.com/${v.audio.url}`} autoPlay onEnded={() => setPlayingId(null)} onError={() => { setError("Could not play audio."); setPlayingId(null); }}/>)}
              </div>
            ))
          ) : <div className="text-center py-20 text-gray-500">No verses found.</div>}
        </div>
      </main>

      <aside className="w-80 bg-[#F7F9F9] border-l border-gray-200/80 flex-col hidden lg:flex flex-shrink-0">
        <div className="p-4 text-center"><h2 className="text-xl font-bold text-gray-800">Settings</h2></div>
        
        <div className="flex-grow">
            <CollapsibleSection title="Reading Setting" icon={<FaBookReader size={20} className="text-teal-700" />}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Translations</label>
                <button onClick={() => setIsTranslationPanelOpen(true)} className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-lg p-2.5 text-sm text-left hover:border-teal-500 transition">
                    <span className="truncate text-gray-800">{selectedTranslationName}</span>
                    <FaChevronDown className="text-gray-500" />
                </button>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Font Setting" icon={<FaFontSetting size={20} className="text-teal-700" />}>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm"><label className="text-gray-700">Arabic Font Size</label><span className="font-semibold text-teal-700">{settings.arabicFontSize}</span></div>
                  <input type="range" min="16" max="48" value={settings.arabicFontSize} onChange={e => setSettings(s => ({ ...s, arabicFontSize: +e.target.value }))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"/>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm"><label className="text-gray-700">Translation Font Size</label><span className="font-semibold text-teal-700">{settings.translationFontSize}</span></div>
                  <input type="range" min="12" max="28" value={settings.translationFontSize} onChange={e => setSettings(s => ({ ...s, translationFontSize: +e.target.value }))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"/>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Arabic Font Face</label>
                  <select onChange={e => setSettings(s => ({ ...s, arabicFontFace: e.target.value }))} value={settings.arabicFontFace} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:border-teal-500 text-gray-800">
                    {arabicFonts.map(font => (<option key={font.name} value={font.value}>{font.name}</option>))}
                  </select>
                </div>
              </div>
            </CollapsibleSection>
        </div>
      </aside>

      {/* Translation Panel Overlay */}
      {isTranslationPanelOpen && <div onClick={() => setIsTranslationPanelOpen(false)} className="fixed inset-0 bg-black/20 z-40"></div>}

      {/* Translation Panel */}
      <div className={`fixed top-0 right-0 w-80 h-full bg-[#F7F9F9] flex flex-col transition-transform duration-300 ease-in-out z-50 shadow-lg ${isTranslationPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200/80">
              <button onClick={() => setIsTranslationPanelOpen(false)} className="p-2 rounded-full hover:bg-gray-200"><FaArrowLeft size={18} /></button>
              <h2 className="font-bold text-lg text-gray-800">Translations</h2>
              <div className="w-8"></div>
          </div>
          <div className="p-3 border-b border-gray-200/80">
              <div className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"/>
              </div>
          </div>
          <div className="flex-grow overflow-y-auto">
              {sortedLanguageKeys.map(lang => (
              <div key={lang}>
                  <h3 className="sticky top-0 bg-gray-100 px-4 py-2 font-bold text-teal-800 text-sm">{lang}</h3>
                  <div className="p-2 space-y-1">
                  {groupedTranslations[lang].map(opt => (
                      <label key={opt.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-teal-50 cursor-pointer">
                      <input type="radio" name="translation" className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300" checked={settings.translationId === opt.id} onChange={() => { setSettings(s => ({ ...s, translationId: opt.id })); setIsTranslationPanelOpen(false); }}/>
                      <span className="text-sm text-gray-700">{opt.name}</span>
                      </label>
                  ))}
                  </div>
              </div>
              ))}
          </div>
      </div>
    </div>
  );
}
