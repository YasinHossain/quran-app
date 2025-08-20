'use client';
import type React from 'react';
import { BarsIcon, SunIcon, MoonIcon } from './icons';
import { SearchInput } from './components/SearchInput';
import { useTranslation } from 'react-i18next';
import { useSidebar } from '@/app/providers/SidebarContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCog } from 'react-icons/fa';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useTheme } from '@/app/providers/ThemeContext';

const Header = () => {
  const { t } = useTranslation();
  const { setSurahListOpen, setSettingsOpen } = useSidebar();
  const { setTheme } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { isHidden } = useHeaderVisibility();

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const headerBgClass = 'bg-background';

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-16 grid grid-cols-[auto_1fr_auto] items-center px-4 sm:px-8 ${headerBgClass} text-foreground transform transition-transform duration-300 ${isHidden ? '-translate-y-full shadow-none' : 'translate-y-0 shadow-sm'} border-b border-transparent overflow-hidden`}
      style={{ zIndex: 'var(--z-fixed)' }}
    >
      {/* Column 1: Title & Surah List Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSurahListOpen(true)}
          className="p-2 rounded-md hover:bg-surface/60 lg:hidden"
          aria-label="Open Surah List"
        >
          <BarsIcon size={20} />
        </button>
        <h1 className="text-xl font-semibold">{t('title')}</h1>
      </div>

      {/* Column 2: Centered Search Bar */}
      <div className="flex justify-center">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={t('search_placeholder')}
          onKeyDown={handleKeyDown}
          className="w-full max-w-lg"
          variant="panel"
        />
      </div>

      {/* Column 3: Theme Toggle & Settings Button */}
      <div className="flex items-center gap-2 justify-end">
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
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 rounded-md hover:bg-surface/60 lg:hidden"
          aria-label="Open Settings"
        >
          <FaCog size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
