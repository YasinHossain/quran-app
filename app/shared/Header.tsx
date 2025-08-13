'use client';
import { BarsIcon } from './icons';
import { SearchInput } from './components/SearchInput';
import { useTranslation } from 'react-i18next';
import { useSidebar } from '@/app/providers/SidebarContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCog } from 'react-icons/fa';
import { useTheme } from '@/app/providers/ThemeContext';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';

const Header = () => {
  const { t } = useTranslation();
  const { setSurahListOpen, setSettingsOpen } = useSidebar();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { theme } = useTheme(); // Use the theme context to determine colors
  const { isHidden } = useHeaderVisibility();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  // Use a stable header background based on the current theme
  const headerBgClass = theme === 'light' ? 'bg-white' : 'bg-[var(--background)]';

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-16 grid grid-cols-[auto_1fr_auto] items-center px-4 sm:px-8 ${headerBgClass} text-gray-800 dark:text-gray-100 z-50 transform transition-transform duration-300 ${isHidden ? '-translate-y-full shadow-none' : 'translate-y-0 shadow-sm'} border-b border-transparent overflow-hidden`}
    >
      {/* Column 1: Title & Surah List Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSurahListOpen(true)}
          className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
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
        />
      </div>

      {/* Column 3: Settings Button */}
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
