'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { getSurahList } from '@/lib/api';
import { GlassCard, NumberBadge } from '@/app/shared/ui';
import type { Surah } from '@/types';

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
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (filteredSurahs.length === 0) {
    return (
      <div className="text-center py-10 col-span-full content-visibility-auto animate-fade-in-up">
        <p className="text-content-muted">No Surahs found for your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredSurahs.map((surah) => (
        <GlassCard
          href={`/surah/${surah.number}`}
          key={surah.number}
          variant="surface"
          size="comfortable"
          radius="xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <NumberBadge number={surah.number} />
              <div>
                <h3 className="font-semibold text-lg text-content-primary">{surah.name}</h3>
                <p className="text-sm text-content-secondary">{surah.meaning}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-amiri text-2xl text-content-primary group-hover:text-accent transition-colors">
                {surah.arabicName}
              </p>
              <p className="text-sm text-content-secondary">{surah.verses} Verses</p>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
