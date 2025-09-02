'use client';

import React, { useState, useEffect } from 'react';
import { Word } from '@/types';
import Spinner from '@/app/shared/Spinner';
import { applyTajweed } from '@/lib/text/tajweed';
import { stripHtml } from '@/lib/text/stripHtml';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { useVerseOfDay } from '../hooks/useVerseOfDay';
import { useSettings } from '@/app/providers/SettingsContext';

export default function VerseOfDay() {
  const { settings } = useSettings();
  const { verse, loading, error, surahs, refreshVerse } = useVerseOfDay();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayVerse, setDisplayVerse] = useState(verse);
  const [initialLoad, setInitialLoad] = useState(true);

  // Handle verse transitions with smooth animation
  useEffect(() => {
    if (!verse) return;

    if (initialLoad) {
      // First verse load
      setDisplayVerse(verse);
      setInitialLoad(false);
      return;
    }

    if (displayVerse && verse.id !== displayVerse.id) {
      // Start transition animation
      setIsTransitioning(true);

      // After fade out completes, update verse and fade in
      const timer = setTimeout(() => {
        setDisplayVerse(verse);
        setIsTransitioning(false);
      }, 300); // Smooth transition duration

      return () => clearTimeout(timer);
    }
  }, [verse, displayVerse, initialLoad]);

  if (loading && initialLoad) {
    return (
      <div className="mt-12 w-full max-w-4xl p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg backdrop-blur-xl content-visibility-auto animate-fade-in-up animation-delay-400 bg-surface-glass/60">
        <div className="flex justify-center py-8">
          <Spinner className="h-6 w-6 text-accent" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 w-full max-w-4xl p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg backdrop-blur-xl content-visibility-auto animate-fade-in-up animation-delay-400 bg-surface-glass/60">
        <div className="text-center py-8">
          <p className="text-status-error mb-4">{error}</p>
          <button
            onClick={refreshVerse}
            className="px-4 py-2 bg-accent text-on-accent rounded-lg hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50"
            aria-label="Retry loading verse"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!displayVerse) {
    return null;
  }

  const [surahNum] = displayVerse.verse_key.split(':');
  const surahName = surahs.find((s) => s.number === Number(surahNum))?.name;

  return (
    <div className="mt-12 w-full max-w-4xl p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg backdrop-blur-xl content-visibility-auto animate-fade-in-up animation-delay-400 bg-surface-glass/60">
      <div
        className={`transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      >
        <h3
          className="font-amiri text-3xl md:text-4xl leading-relaxed text-right text-content-accent"
          dir="rtl"
        >
          {displayVerse.words && displayVerse.words.length > 0 ? (
            displayVerse.words.map((w: Word) => (
              <span key={w.id} className="inline-block mx-0.5 relative group">
                {settings.tajweed ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(applyTajweed(w.uthmani)),
                    }}
                  />
                ) : (
                  w.uthmani
                )}
                {w.en && (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1 py-0.5 rounded bg-accent text-on-accent text-xs whitespace-nowrap opacity-0 group-hover:opacity-100">
                    {w.en}
                  </span>
                )}
              </span>
            ))
          ) : settings.tajweed ? (
            <span
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(applyTajweed(displayVerse.text_uthmani)),
              }}
            />
          ) : (
            displayVerse.text_uthmani
          )}
        </h3>
        {displayVerse.translations?.[0] && (
          <p className="mt-4 text-left text-sm text-content-secondary">
            &quot;{stripHtml(displayVerse.translations[0].text)}&quot; - [Surah{' '}
            {surahName ?? surahNum}, {displayVerse.verse_key}]
          </p>
        )}
      </div>
    </div>
  );
}
