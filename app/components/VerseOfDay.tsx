'use client';
import React, { useEffect, useState } from 'react';
import { Verse } from '@/types';
import { getRandomVerse } from '@/lib/api';
import { useSettings } from '@/app/context/SettingsContext';
import Spinner from '@/app/components/common/Spinner';
import surahsData from '@/data/surahs.json';
import type { Surah } from '@/types';

const surahs: Surah[] = surahsData;

export default function VerseOfDay() {
  const { settings } = useSettings();
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
        <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">Verse of the Day</p>
        <h3 className="font-amiri text-3xl md:text-4xl text-emerald-600 dark:text-emerald-400 leading-relaxed text-right" dir="rtl">
          {verse.text_uthmani}
        </h3>
        {verse.translations?.[0] && (
          <p className="mt-4 text-left text-slate-600 dark:text-slate-400 text-sm">
            &quot;{verse.translations[0].text}&quot; - [Surah {surahName ?? surahNum}, {verse.verse_key}]
          </p>
        )}
      </>
    );
  }

  return (
    <div className="mt-12 w-full max-w-3xl p-4 sm:p-6 md:p-8 bg-white/30 dark:bg-slate-800/30 border border-white/50 dark:border-slate-700/50 rounded-2xl shadow-lg backdrop-blur-xl content-visibility-auto animate-fade-in-up animation-delay-400">
      {content}
    </div>
  );
}
