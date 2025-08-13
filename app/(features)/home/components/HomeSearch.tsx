'use client';
import { SearchIcon } from '@/app/shared/icons';
import { useTheme } from '@/app/providers/ThemeContext';

interface HomeSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function HomeSearch({ searchQuery, setSearchQuery }: HomeSearchProps) {
  const { theme } = useTheme();
  const shortcutSurahs = ['Al-Mulk', 'Al-Kahf', 'Ya-Sin', 'Al-Ikhlas'];

  return (
    <>
      <div className="mt-10 w-full max-w-2xl mx-auto content-visibility-auto animate-fade-in-up animation-delay-200 p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="relative">
          <input
            type="text"
            placeholder="What do you want to read?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-lg bg-transparent border-none focus:ring-0 focus:outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-slate-500 dark:text-slate-400">
            <SearchIcon className="w-6 h-6" />
          </div>
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
