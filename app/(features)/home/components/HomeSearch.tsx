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
      {/* Mobile-optimized search container */}
      <div className="w-full max-w-xs md:max-w-lg lg:max-w-2xl mx-auto px-4 md:px-0 content-visibility-auto animate-fade-in-up animation-delay-200">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="What do you want to read?"
          size="lg"
          variant="glass"
          className="text-base md:text-lg"
        />
      </div>

      {/* Mobile-optimized shortcut buttons */}
      <div className="px-4 md:px-0 content-visibility-auto animate-fade-in-up animation-delay-200">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-sm md:max-w-lg lg:max-w-2xl mx-auto">
          {shortcutSurahs.map((name) => (
            <button
              key={name}
              onClick={() => handleShortcutClick(name)}
              className="min-h-11 px-3 md:px-4 lg:px-5 py-2 md:py-2.5 rounded-full font-medium text-sm md:text-base shadow-sm transition-all duration-200 bg-button-secondary border border-border text-content-primary hover:bg-button-secondary-hover hover:shadow-md active:scale-95 backdrop-blur-md touch-manipulation"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export default HomeSearch;
