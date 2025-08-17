'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/app/providers/ThemeContext';
import { getSurahList } from '@/lib/api';
import type { Surah } from '@/types';
import Spinner from '@/app/shared/Spinner';
import ThemedCard from './ThemedCard';

interface SurahTabProps {
  searchQuery: string;
}

export default function SurahTab({ searchQuery }: SurahTabProps) {
  const { theme } = useTheme();
  const [allSurahs, setAllSurahs] = useState<Surah[]>([]);

  useEffect(() => {
    getSurahList()
      .then(setAllSurahs)
      .catch((err) => console.error(err));
  }, []);

  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return allSurahs;
    return allSurahs.filter(
      (surah) =>
        surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.number.toString().includes(searchQuery)
    );
  }, [searchQuery, allSurahs]);

  if (allSurahs.length === 0) {
    return (
      <div className="flex justify-center py-10 col-span-full">
        <Spinner className="h-6 w-6 text-emerald-600" />
      </div>
    );
  }

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
        <ThemedCard href={`/surah/${surah.number}`} key={surah.number}>
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
        </ThemedCard>
      ))}
    </div>
  );
}
