'use client';
import { useTheme } from '@/app/providers/ThemeContext';
import { SunIcon, MoonIcon } from '@/app/shared/icons';

export default function HomeHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full py-4">
      <nav className="flex justify-between items-center max-w-screen-2xl mx-auto p-3 sm:p-4 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-surface/60">
        <h1 className="text-2xl font-bold tracking-wider text-foreground">Al Qur&apos;an</h1>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 bg-surface/40 rounded-full hover:bg-surface/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </button>
      </nav>
    </header>
  );
}
