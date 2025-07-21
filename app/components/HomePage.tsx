'use client';
import React, { useState, useMemo } from 'react';
import { Chapter } from '@/types';
import { useTheme } from '@/app/context/ThemeContext';
import design from '../../design-system.json';

interface HomePageProps {
  chapters: Chapter[];
}

export default function HomePage({ chapters }: HomePageProps) {
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [juzFilter, setJuzFilter] = useState('');
  const [pageFilter, setPageFilter] = useState('');

  const filteredChapters = useMemo(() => {
    return chapters.filter(ch =>
      ch.name_simple.toLowerCase().includes(search.toLowerCase())
    );
  }, [chapters, search]);

  const juzs = useMemo(() => Array.from({ length: 30 }, (_, i) => i + 1), []);
  const pages = useMemo(() => Array.from({ length: 604 }, (_, i) => i + 1), []);

  const colors = theme === 'dark' ? {
    background: design.colors.backgroundDark,
    foreground: design.colors.foregroundDark,
    border: design.colors.borderDark
  } : {
    background: design.colors.background,
    foreground: design.colors.foreground,
    border: design.colors.border
  };

  return (
    <div style={{ background: colors.background, color: colors.foreground, fontFamily: design.typography.fontFamily }} className="min-h-screen flex flex-col">
      <nav
        className="backdrop-blur-md bg-white/30 dark:bg-gray-900/30 sticky top-0 z-20"
        style={{ padding: design.spacing.md, borderBottom: `1px solid ${colors.border}` }}
      >
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <span style={{ fontSize: design.typography.h1 }} className="font-semibold">Quran</span>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{ padding: design.spacing.sm }}
            className="rounded-md border"
          >
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>
      </nav>
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto" style={{ padding: design.spacing.lg }}>
          <div className="flex flex-col items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search Surah"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-md border"
              style={{ borderColor: colors.border, background: colors.background, color: colors.foreground }}
            />
            <div className="flex gap-4">
              <select
                value={juzFilter}
                onChange={e => setJuzFilter(e.target.value)}
                className="px-4 py-2 rounded-md border"
                style={{ borderColor: colors.border, background: colors.background, color: colors.foreground }}
              >
                <option value="">Juz</option>
                {juzs.map(j => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
              <select
                value={pageFilter}
                onChange={e => setPageFilter(e.target.value)}
                className="px-4 py-2 rounded-md border"
                style={{ borderColor: colors.border, background: colors.background, color: colors.foreground }}
              >
                <option value="">Page</option>
                {pages.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))' }}>
            {filteredChapters.map(ch => (
              <div key={ch.id} className="p-4 rounded-lg border" style={{ borderColor: colors.border, background: colors.background }}>
                <p className="text-sm text-gray-500">{ch.verses_count} verses</p>
                <h2 style={{ fontSize: design.typography.h2 }} className="font-semibold mb-1">
                  {ch.name_simple}
                </h2>
                <p className="text-xl font-arabic">{ch.name_arabic}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
