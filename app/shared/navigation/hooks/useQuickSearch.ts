'use client';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

export function useQuickSearch(onClose: () => void) {
  const [query, setQuery] = useState('');
  const [recentSearches] = useState([
    'Al-Fatiha',
    'Ayatul Kursi',
    'Surah Rahman',
    'Last 10 Surahs',
  ]);
  const [trendingSearches] = useState([
    'Surah Yaseen',
    'Surah Mulk',
    'Surah Kahf',
    'Dua collection',
  ]);
  const router = useRouter();

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (searchQuery.trim()) {
        router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        onClose();
        setQuery('');
      }
    },
    [router, onClose]
  );

  return {
    query,
    setQuery,
    recentSearches,
    trendingSearches,
    handleSearch,
  } as const;
}
