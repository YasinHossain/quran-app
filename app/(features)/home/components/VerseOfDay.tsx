'use client';

import React from 'react';
import { Word } from '@/types';
import Spinner from '@/app/shared/Spinner';
import { applyTajweed } from '@/lib/text/tajweed';
import { stripHtml } from '@/lib/text/stripHtml';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { useVerseOfDay } from '../hooks/useVerseOfDay';
import { useSettings } from '@/app/providers/SettingsContext';

export default function VerseOfDay() {
  const { settings } = useSettings();
  const { verse, loading, error, surahs } = useVerseOfDay();

  if (loading) {
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
        <div className="text-center py-8 text-status-error">{error}</div>
      </div>
    );
  }

  if (!verse) {
    return null;
  }

  const [surahNum] = verse.verse_key.split(':');
  const surahName = surahs.find((s) => s.number === Number(surahNum))?.name;

  return (
    <div className="mt-12 w-full max-w-4xl p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg backdrop-blur-xl content-visibility-auto animate-fade-in-up animation-delay-400 bg-surface-glass/60">
      <h3
        className="font-amiri text-3xl md:text-4xl leading-relaxed text-right text-content-accent"
        dir="rtl"
      >
        {verse.words && verse.words.length > 0 ? (
          verse.words.map((w: Word) => (
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
              __html: sanitizeHtml(applyTajweed(verse.text_uthmani)),
            }}
          />
        ) : (
          verse.text_uthmani
        )}
      </h3>
      {verse.translations?.[0] && (
        <p className="mt-4 text-left text-sm text-content-secondary">
          &quot;{stripHtml(verse.translations[0].text)}&quot; - [Surah {surahName ?? surahNum},{' '}
          {verse.verse_key}]
        </p>
      )}
    </div>
  );
}
