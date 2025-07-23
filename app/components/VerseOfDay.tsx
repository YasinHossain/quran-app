'use client';
import React, { useEffect, useState } from 'react';
import { Verse } from '@/types';
import { getRandomVerse } from '@/lib/api';
import { useSettings } from '@/app/context/SettingsContext';
import Spinner from '@/app/components/common/Spinner';
import surahsData from '@/data/surahs.json';
import type { Surah } from '@/types';
import { useTheme } from '@/app/context/ThemeContext';

const surahs: Surah[] = surahsData;

export default function VerseOfDay() {
  const { settings } = useSettings();
  const { theme } = useTheme();
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getRandomVerse(settings.translationId)
      .then(v => {
        setVerse(v);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load verse.');
      })
      .finally(() => setLoading(false));
  }, [settings.translationId]);

  let content: React.ReactNode = null;
  if (loading) {
    content = (
      <div className="flex justify-center py-8">
        <Spinner className="h-6 w-6 text-emerald-600" />
      </div>
    );
  } else if (error) {
    content = <div className="text-center py-8 text-red-600">{error}</div>;
  } else if (verse) {
    const [surahNum] = verse.verse_key.split(':');
    const surahName = surahs.find(s => s.number === Number(surahNum))?.name;
    content = (
      <>
        {/* <p className={`mb-4 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Verse of the Day</p> */}
        <h3 className={`font-amiri text-3xl md:text-4xl leading-relaxed text-right ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`} dir="rtl">
          {verse.text_uthmani}
        </h3>
        {verse.translations?.[0] && (
          <p className={`mt-4 text-left text-sm ${theme === 'light' ? 'text-slate-800' : 'text-slate-400'}`}>
            &quot;{verse.translations[0].text}&quot; - [Surah {surahName ?? surahNum}, {verse.verse_key}]
          </p>
        )}
      </>
    );
  }

  return (
    <div className={`mt-12 w-full max-w-3xl p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg backdrop-blur-xl content-visibility-auto animate-fade-in-up animation-delay-400 ${theme === 'light' ? 'bg-white/60' : 'bg-slate-800/30'}`}>
      {content}
    </div>
  );
}
