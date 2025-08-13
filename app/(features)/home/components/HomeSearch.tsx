'use client';
import { SearchSolidIcon } from '@/app/shared/icons';
import { useTheme } from '@/app/providers/ThemeContext';

interface HomeSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function HomeSearch({ searchQuery, setSearchQuery }: HomeSearchProps) {
  const { theme } = useTheme();
  const shortcutSurahs = ['Al-Mulk', 'Al-Kahf', 'Ya-Sin', 'Al-Ikhlas'];
  
  const searchBarClasses =
    theme === 'light'
      ? 'bg-white text-gray-700 border border-gray-200 placeholder-gray-400'
      : 'bg-gray-800 text-gray-200 border border-gray-600 placeholder-gray-400';

  return (
    <>
      <div className="mt-10 w-full max-w-2xl mx-auto content-visibility-auto animate-fade-in-up animation-delay-200 p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="relative">
          <SearchSolidIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="What do you want to read?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-teal-600 text-lg ${searchBarClasses}`}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3 content-visibility-auto animate-fade-in-up animation-delay-200">
        {shortcutSurahs.map((name) => (
          <button
            key={name}
            className={`px-4 sm:px-5 py-2 rounded-full font-medium shadow-sm transition-all duration-200 ${
              theme === 'light'
                ? 'bg-white border border-gray-200 text-slate-800 hover:bg-gray-100 hover:shadow-md'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-300 backdrop-blur-md hover:bg-slate-700/60 hover:scale-105 transform hover:shadow-md'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </>
  );
}
