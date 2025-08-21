import { SearchInput } from '@/app/shared/components/SearchInput';

interface HomeSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function HomeSearch({ searchQuery, setSearchQuery }: HomeSearchProps) {
  const shortcutSurahs = ['Al-Mulk', 'Al-Kahf', 'Ya-Sin', 'Al-Ikhlas'];

  const handleShortcutClick = (surahName: string) => {
    setSearchQuery(surahName);
  };

  return (
    <>
      {/* Mobile-optimized search container */}
      <div className="mt-6 sm:mt-8 lg:mt-10 w-full max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto px-4 sm:px-0 content-visibility-auto animate-fade-in-up animation-delay-200">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="What do you want to read?"
          size="lg"
          variant="glass"
          className="text-mobile sm:text-lg"
        />
      </div>

      {/* Mobile-optimized shortcut buttons */}
      <div className="mt-4 sm:mt-6 px-4 sm:px-0 content-visibility-auto animate-fade-in-up animation-delay-200">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-sm sm:max-w-lg lg:max-w-2xl mx-auto">
          {shortcutSurahs.map((name) => (
            <button
              key={name}
              onClick={() => handleShortcutClick(name)}
              className="btn-touch px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-full font-medium text-mobile-sm sm:text-mobile shadow-sm transition-all duration-200 bg-button-secondary border border-border text-content-primary hover:bg-button-secondary-hover hover:shadow-md active:scale-95 backdrop-blur-md"
              style={{ touchAction: 'manipulation' }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
