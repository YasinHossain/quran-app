// app/components/Header.tsx
'use client';
import { FaSearch, FaBars, FaFontSetting } from './SvgIcons';
import { useTranslation } from 'react-i18next';
import { useSidebar } from '@/app/context/SidebarContext';

const Header = () => {
  const { t } = useTranslation();
  const { setSurahListOpen, setSettingsOpen } = useSidebar();
  return (
    // CHANGE: Adjusted background, padding, and grid layout for cleaner look
    <header className="h-16 grid grid-cols-3 items-center px-4 sm:px-8 bg-white shadow-sm sticky top-0 z-30">
      {/* Column 1: Title */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSurahListOpen(true)}
          className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
        >
          <FaBars size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">{t('title')}</h1>
      </div>

      {/* Column 2: Centered Search Bar */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-lg">
          <FaSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /> {/* Adjusted icon position */}
          <input
            type="text"
            placeholder={t('search_placeholder')}
            // CHANGE: Softer border, adjusted padding, and rounded corners
            className="w-full bg-gray-100 border border-gray-200 rounded-md py-2 px-10 focus:ring-1 focus:ring-teal-500 outline-none transition text-gray-700"
          /> {/* Adjusted styles */}
        </div>
      </div>

      {/* Column 3: Settings button on small screens */}
      <div className="flex justify-end">
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
        >
          <FaFontSetting size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
