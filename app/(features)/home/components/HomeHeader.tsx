'use client';
import { useTheme } from '@/app/providers/ThemeContext';
import { Sun, Moon } from '@/app/shared/SvgIcons';

export default function HomeHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full py-4">
      <nav
        className={`flex justify-between items-center max-w-screen-2xl mx-auto p-3 sm:p-4 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 ${theme === 'light' ? 'bg-white/60' : 'bg-slate-800/50'}`}
      >
        <h1
          className={`text-2xl font-bold tracking-wider ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}
        >
          Al Qur&apos;an
        </h1>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 bg-white/40 dark:bg-white/10 rounded-full hover:bg-white/60 dark:hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-slate-700" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
        </button>
      </nav>
    </header>
  );
}
