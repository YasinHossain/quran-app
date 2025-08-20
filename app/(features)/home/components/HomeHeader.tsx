'use client';
import { ThemeToggle } from '@/app/shared/ui';

export default function HomeHeader() {
  return (
    <header className="w-full py-4">
      <nav className="flex justify-between items-center max-w-screen-2xl mx-auto p-3 sm:p-4 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-surface/60">
        <h1 className="text-2xl font-bold tracking-wider text-primary">Al Qur&apos;an</h1>
        <ThemeToggle />
      </nav>
    </header>
  );
}
