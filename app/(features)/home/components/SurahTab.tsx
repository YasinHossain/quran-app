'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { useTheme } from '@/app/providers/ThemeContext';
import surahsData from '@/data/surahs.json';
import type { Surah } from '@/types';

interface SurahTabProps {
  searchQuery: string;
}

const allSurahs: Surah[] = surahsData;

export default function SurahTab({ searchQuery }: SurahTabProps) {
  const { theme } = useTheme();

  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return allSurahs;
    return allSurahs.filter(
      (surah) =>
        surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.number.toString().includes(searchQuery)
    );
  }, [searchQuery]);

  if (filteredSurahs.length === 0) {
    return (
      <div className="text-center py-10 col-span-full content-visibility-auto animate-fade-in-up">
        <p className="text-slate-500 dark:text-slate-400">No Surahs found for your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredSurahs.map((surah) => (
        <Link
          href={`/surah/${surah.number}`}
          key={surah.number}
          className={`group p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 content-visibility-auto animate-fade-in-up ${theme === 'light' ? 'bg-white/60' : 'bg-slate-800/40'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg transition-colors ${
                  theme === 'light'
                    ? 'bg-gray-100 text-emerald-600 group-hover:bg-emerald-100'
                    : 'bg-slate-700/50 text-emerald-400 group-hover:bg-emerald-500/20'
                }`}
              >
                {surah.number}
              </div>
              <div>
                <h3
                  className={`font-semibold text-lg ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}
                >
                  {surah.name}
                </h3>
                <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                  {surah.meaning}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-amiri text-2xl ${
                  theme === 'light'
                    ? 'text-slate-800 group-hover:text-emerald-600'
                    : 'text-slate-300 group-hover:text-emerald-400'
                } transition-colors`}
              >
                {surah.arabicName}
              </p>
              <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                {surah.verses} Verses
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
