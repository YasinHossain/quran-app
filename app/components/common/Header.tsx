// app/components/Header.tsx
'use client';
import { FaSearch } from './SvgIcons';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();
  return (
    // CHANGE: Adjusted background, padding, and grid layout for cleaner look
    <header className="h-16 grid grid-cols-3 items-center px-8 bg-white shadow-sm sticky top-0 z-30">
      {/* Column 1: Title */}
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">{t('title')}</h1> {/* Adjusted text color and font weight */}
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

      {/* Column 3: Empty div for spacing, keeps search bar centered */}
      <div></div>
    </header>
  );
};

export default Header;
