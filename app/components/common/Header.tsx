'use client';
import { FaSearch, FaBars } from './SvgIcons';
import { useTranslation } from 'react-i18next';
import { useSidebar } from '@/app/context/SidebarContext';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaCog } from 'react-icons/fa';
import { useTheme } from '@/app/context/ThemeContext';

interface HeaderProps {
  isHidden?: boolean;
}

const Header = ({ isHidden = false }: HeaderProps) => {
  const { t } = useTranslation();
  const { setSurahListOpen, setSettingsOpen } = useSidebar();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { theme } = useTheme(); // Use the theme context to determine colors
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const scrollEl = document.querySelector('.homepage-scrollable-area');
    if (!scrollEl) return;

    const handleScroll = () => {
      const currentY = (scrollEl as HTMLElement).scrollTop;
      if (currentY > lastScrollY.current && currentY > 50) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollY.current = currentY;
    };

    scrollEl.addEventListener('scroll', handleScroll);
    return () => scrollEl.removeEventListener('scroll', handleScroll);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/features/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  // Determine background classes based on the current theme
  const searchBarBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  // Use a transparent header background to avoid tinting underlying content
  const headerBgClass = 'bg-transparent';

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-16 grid grid-cols-[auto_1fr_auto] items-center px-4 sm:px-8 ${headerBgClass} text-gray-800 dark:text-gray-100 shadow-sm z-50 transform transition-transform duration-300 ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
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
