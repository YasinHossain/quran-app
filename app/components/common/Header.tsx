// app/components/Header.tsx
'use client';
import { FaSearch, FaBars } from './SvgIcons';
import { useTranslation } from 'react-i18next';
import { useSidebar } from '@/app/context/SidebarContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCog } from 'react-icons/fa';

const Header = () => {
  const { t } = useTranslation();
  const { setSurahListOpen, setSettingsOpen } = useSidebar();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/features/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    // Adjusted background, padding, and grid layout for cleaner look
    <header className="h-16 grid grid-cols-3 items-center px-4 sm:px-8 bg-[var(--background)] text-[var(--foreground)] shadow-sm sticky top-0 z-30">
      {/* Column 1: Title & Surah List Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSurahListOpen(true)}
          className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          aria-label="Open Surah List"
        >
          <FaBars size={20} />
        </button>
        <h1 className="text-xl font-semibold text-[var(--foreground)]">{t('title')}</h1>
      </div>

      {/* Column 2: Centered Search Bar */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-lg">
          <FaSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md py-2 px-10 focus:ring-1 focus:ring-teal-500 outline-none transition text-gray-700 dark:text-gray-200"
          />
        </div>
      </div>

      {/* Column 3: Settings button */}
      <div className="flex justify-end">
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 rounded-md hover:bg-gray-100 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          aria-label="Open Settings"
        >
          <FaCog size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
