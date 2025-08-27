'use client';
import { SunIcon, MoonIcon } from '@/presentation/shared/icons';
import { GlassCard } from '@/presentation/shared/ui';
import { useTheme } from '@/presentation/providers/ThemeContext';

export default function HomeHeader() {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setTheme('light');
    } else {
      html.classList.add('dark');
      setTheme('dark');
    }
  };

  return (
    <header className="w-full py-4">
      <GlassCard
        variant="surface"
        size="comfortable"
        radius="xl"
        className="max-w-screen-2xl mx-auto"
      >
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wider text-content-primary">Al Qur&apos;an</h1>
          <button
            onClick={toggleTheme}
            className="p-2 bg-button-secondary/40 rounded-full hover:bg-button-secondary-hover/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <SunIcon className="w-5 h-5 text-status-warning" />
            ) : (
              <MoonIcon className="w-5 h-5 text-content-secondary" />
            )}
          </button>
        </nav>
      </GlassCard>
    </header>
  );
}
