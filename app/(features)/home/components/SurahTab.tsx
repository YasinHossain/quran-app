'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getSurahList } from '@/lib/api';
import type { Surah } from '@/types';
import Spinner from '@/app/shared/Spinner';

interface SurahTabProps {
  searchQuery: string;
}

export default function SurahTab({ searchQuery }: SurahTabProps) {
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
        <p className="text-muted">No Surahs found for your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredSurahs.map((surah) => (
        <Link
          href={`/surah/${surah.number}`}
          key={surah.number}
          className="group p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 content-visibility-auto animate-fade-in-up bg-surface/60"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg transition-colors bg-surface text-accent group-hover:bg-accent/10">
                {surah.number}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-primary">{surah.name}</h3>
                <p className="text-sm text-muted">{surah.meaning}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-amiri text-2xl text-primary group-hover:text-accent transition-colors">
                {surah.arabicName}
              </p>
              <p className="text-sm text-muted">{surah.verses} Verses</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
