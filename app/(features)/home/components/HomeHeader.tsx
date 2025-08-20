'use client';
import { SunIcon, MoonIcon } from '@/app/shared/icons';
import { GlassCard } from '@/app/shared/ui';

export default function HomeHeader() {
  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
    } else {
      html.classList.add('dark');
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
            <div className="dark:hidden">
              <MoonIcon className="w-5 h-5 text-content-secondary" />
            </div>
            <div className="hidden dark:block">
              <SunIcon className="w-5 h-5 text-status-warning" />
            </div>
          </button>
        </nav>
      </GlassCard>
    </header>
  );
}
