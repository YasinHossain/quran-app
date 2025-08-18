'use client';
import { SearchSolidIcon } from '@/app/shared/icons';

interface HomeSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function HomeSearch({ searchQuery, setSearchQuery }: HomeSearchProps) {
  const shortcutSurahs = ['Al-Mulk', 'Al-Kahf', 'Ya-Sin', 'Al-Ikhlas'];

  const searchBarClasses = 'bg-surface text-foreground border-none placeholder-muted';

  return (
    <>
      <div className="mt-10 w-full max-w-2xl mx-auto content-visibility-auto animate-fade-in-up animation-delay-200">
        <div className="relative">
          <SearchSolidIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            size={20}
          />
          <input
            type="text"
            placeholder="What do you want to read?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-lg ring-0 focus:outline-none focus:ring-0 transition-all duration-300 hover:shadow-lg text-lg ${searchBarClasses} backdrop-blur-xl shadow-lg hover:shadow-xl bg-surface/60 animate-fade-in-up animation-delay-200`}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3 content-visibility-auto animate-fade-in-up animation-delay-200">
        {shortcutSurahs.map((name) => (
          <button
            key={name}
            className="px-4 sm:px-5 py-2 rounded-full font-medium shadow-sm transition-all duration-200 bg-surface border border-border text-foreground hover:bg-interactive-hover hover:shadow-md"
          >
            {name}
          </button>
        ))}
      </div>
    </>
  );
}
