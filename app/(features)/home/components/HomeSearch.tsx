'use client';

import { memo, useCallback, useMemo } from 'react';

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
  const shortcutSurahs = useMemo(() => ['Al-Mulk', 'Al-Kahf', 'Ya-Sin', 'Al-Ikhlas'], []);

  const handleShortcutClick = useCallback(
    (surahName: string) => {
      setSearchQuery(surahName);
    },
    [setSearchQuery]
  );

  return (
    <div className={`space-y-4 md:space-y-6 ${className || ''}`}>
      {/* Mobile-optimized search container - Wider than shortcuts, narrower than Title */}
      <div className="w-full max-w-lg md:max-w-xl lg:max-w-3xl mx-auto px-4 md:px-0 content-visibility-auto animate-fade-in-up animation-delay-200">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="What do you want to read?"
          size="lg"
          variant="glass"
          className="text-base md:text-lg"
        />
      </div>

      {/* Mobile-optimized shortcut buttons - Narrower than search box */}
      <div className="px-4 md:px-0 content-visibility-auto animate-fade-in-up animation-delay-200">
        <div className="flex flex-nowrap justify-center items-center gap-2 max-w-sm md:max-w-md lg:max-w-lg mx-auto overflow-x-auto scrollbar-hide">
          {shortcutSurahs.map((name) => (
            <button
              key={name}
              onClick={() => handleShortcutClick(name)}
              className="flex-shrink-0 min-h-[2.5rem] md:min-h-11 px-4 py-1.5 md:py-2.5 rounded-full font-medium text-xs md:text-base transition-all duration-200 bg-surface-glass/60 text-foreground hover:bg-surface-glass/80 border-none ring-0 shadow-none hover:shadow-none active:scale-95 backdrop-blur-xl touch-manipulation"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
