// app/components/Header.tsx
'use client';
import { FaSearch, FaBars } from './SvgIcons';
import { useTranslation } from 'react-i18next';
import { useSidebar } from '@/app/context/SidebarContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCog } from 'react-icons/fa';
import { useTheme } from '@/app/context/ThemeContext';

const Header = () => {
  const { t } = useTranslation();
  const { setSurahListOpen, setSettingsOpen } = useSidebar();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { theme } = useTheme(); // Use the theme context to determine colors

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/features/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  // Determine background classes based on theme
  const searchBarBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const headerBgClass = theme === 'light' ? 'bg-white/40' : 'bg-gray-900/40';

  return (
    // Adjusted background, padding, and grid layout for cleaner look
    <header
      className={`fixed top-0 left-0 right-0 h-16 grid grid-cols-[auto_1fr_auto] items-center px-4 sm:px-8 backdrop-blur-md ${headerBgClass} text-gray-800 dark:text-gray-100 shadow-sm z-30`}
    >
      {/* Column 1: Title & Surah List Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSurahListOpen(true)}
          className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          aria-label="Open Surah List"
        >
          <FaBars size={20} />
        </button>
        <h1 className="text-xl font-semibold">{t('title')}</h1>
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
            className={`w-full ${searchBarBgClass} border border-gray-200 dark:border-gray-600 rounded-md py-2 px-10 focus:ring-1 focus:ring-teal-500 outline-none transition text-gray-700 dark:text-gray-200 placeholder-gray-400`}
          />
        </div>
      </div>

      {/* Column 3: Settings button */}
      <div className="flex justify-end">
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          aria-label="Open Settings"
        >
          <FaCog size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
