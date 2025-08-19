'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { getSurahList } from '@/lib/api';
import type { Surah } from '@/types';
import Spinner from '@/app/shared/Spinner';
import { SurahCard } from './SurahCard';

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
        <Spinner className="h-6 w-6 text-accent" />
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
        <SurahCard key={surah.number} surah={surah} />
      ))}
    </div>
  );
}
