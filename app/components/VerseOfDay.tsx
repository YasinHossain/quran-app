'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Verse, Word } from '@/types';
import { getRandomVerse } from '@/lib/api';
import { useSettings } from '@/app/context/SettingsContext';
import Spinner from '@/app/components/shared/Spinner';
import surahsData from '@/data/surahs.json';
import type { Surah } from '@/types';
import { useTheme } from '@/app/context/ThemeContext';
import { applyTajweed } from '@/lib/tajweed';
import { stripHtml } from '@/lib/stripHtml';

const surahs: Surah[] = surahsData;

export default function VerseOfDay() {
  const { settings } = useSettings();
  const { theme } = useTheme();
  const [verse, setVerse] = useState<Verse | null>(null);
  const [verseQueue, setVerseQueue] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef(false);

  const prefetchVerse = useCallback(async () => {
    try {
      const v = await getRandomVerse(settings.translationId);
      if (abortRef.current) return;
      setVerseQueue((q) => [...q, v]);
    } catch (err) {
      console.error(err);
      if (abortRef.current) return;
      setError('Failed to load verse.');
    }
  }, [settings.translationId]);

  useEffect(() => {
    abortRef.current = false;
    setVerse(null);
    setVerseQueue([]);
    setError(null);
    setLoading(true);

    const init = async () => {
      await Promise.all([prefetchVerse(), prefetchVerse(), prefetchVerse()]);
    };

    init().then(() => {
      if (abortRef.current) return;
      setVerseQueue((q) => {
        if (q.length === 0) return q;
        const [first, ...rest] = q;
        setVerse(first);
        return rest;
      });
      setLoading(false);
    });

    const intervalId = setInterval(() => {
      setVerseQueue((q) => {
        if (q.length === 0) return q;
        const [next, ...rest] = q;
        setVerse(next);
        return rest;
      });
    }, 10000);

    return () => {
      abortRef.current = true;
      clearInterval(intervalId);
    };
  }, [prefetchVerse]);

  useEffect(() => {
    if (verseQueue.length < 2) {
      prefetchVerse();
    }
  }, [verseQueue, prefetchVerse]);

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
    const surahName = surahs.find((s) => s.number === Number(surahNum))?.name;
    content = (
      <>
        <h3
          className={`font-amiri text-3xl md:text-4xl leading-relaxed text-right ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}
          dir="rtl"
        >
          {verse.words && verse.words.length > 0 ? (
            verse.words.map((w: Word) => (
              <span key={w.id} className="inline-block mx-0.5 relative group">
                {settings.tajweed ? (
                  <span dangerouslySetInnerHTML={{ __html: applyTajweed(w.uthmani) }} />
                ) : (
                  w.uthmani
                )}
                {w.en && (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1 py-0.5 rounded bg-gray-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100">
                    {w.en}
                  </span>
                )}
              </span>
            ))
          ) : settings.tajweed ? (
            <span dangerouslySetInnerHTML={{ __html: applyTajweed(verse.text_uthmani) }} />
          ) : (
            verse.text_uthmani
          )}
        </h3>
        {verse.translations?.[0] && (
          <p
            className={`mt-4 text-left text-sm ${theme === 'light' ? 'text-slate-800' : 'text-slate-400'}`}
          >
            &quot;{stripHtml(verse.translations[0].text)}&quot; - [Surah {surahName ?? surahNum},{' '}
            {verse.verse_key}]
          </p>
        )}
      </>
    );
  }

  return (
    <div
      className={`mt-12 w-full max-w-4xl p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg backdrop-blur-xl content-visibility-auto animate-fade-in-up animation-delay-400 ${theme === 'light' ? 'bg-white/60' : 'bg-slate-800/30'}`}
    >
      {content}
    </div>
  );
}
