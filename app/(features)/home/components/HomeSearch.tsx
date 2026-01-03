'use client';

import { memo, useMemo } from 'react';

import Link from 'next/link';
import { buildSurahRoute } from '@/app/shared/navigation/routes';
import { SearchInput } from '@/app/shared/components/SearchInput';

interface HomeSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  className?: string;
}

/**
 * Home search component with Surah shortcuts.
 * Implements mobile-first responsive design and performance optimization.
 *
 * Features:
 * - Search input with glass effect
 * - Popular Surah shortcuts
 * - Touch-friendly buttons
 * - Mobile-first responsive layout
 */
export const HomeSearch = memo(function HomeSearch({
  searchQuery,
  setSearchQuery,
  className,
}: HomeSearchProps) {
  const shortcutSurahs = useMemo(() => [
    { name: 'Al-Mulk', id: 67 },
    { name: 'Al-Kahf', id: 18 },
    { name: 'Ya-Sin', id: 36 },
    { name: 'Al-Ikhlas', id: 112 },
  ], []);

  return (
    <div className={`w-full space-y-4 md:space-y-5 ${className || ''}`}>
      {/* Search container - full width, parent controls the max-width */}
      <div className="w-full">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by Surah Name or Number..."
          size="lg"
          variant="glass"
          className="text-base md:text-lg"
        />
      </div>

      {/* Shortcut buttons - Narrowest element, with its own width constraint */}
      <div 
        className="w-full mx-auto"
        style={{ maxWidth: 'clamp(14rem, 65vw, 28rem)' }}
      >
        <div className="flex flex-nowrap justify-center items-center gap-1 sm:gap-1.5 md:gap-2">
          {shortcutSurahs.map(({ name, id }) => (
            <Link
              key={name}
              href={buildSurahRoute(id)}
              className="flex-shrink-0 min-h-[2rem] sm:min-h-[2.25rem] md:min-h-10 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full font-medium text-[0.65rem] sm:text-xs md:text-sm transition-all duration-200 bg-surface-glass/60 text-foreground hover:bg-surface-glass/80 border-none ring-0 shadow-sm hover:shadow-md active:scale-95 backdrop-blur-xl touch-manipulation flex items-center justify-center"
            >
              {name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
});
