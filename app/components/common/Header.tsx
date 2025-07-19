// app/components/Header.tsx
'use client';
import { FaSearch } from './SvgIcons';

const Header = () => {
  return (
    // CHANGE: Using a grid layout for better centering
    <header className="h-16 grid grid-cols-3 items-center px-6 bg-[#F0FAF8] sticky top-0 z-30">
      {/* Column 1: Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-teal-700">Quran</h1>
      </div>

      {/* Column 2: Centered Search Bar */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-lg">
          <FaSearch size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="What do you want to read?"
            // CHANGE: rounded-full for the circular look
            className="w-full bg-white border border-gray-200/80 rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-teal-500 outline-none transition"
          />
        </div>
      </div>

      {/* Column 3: Empty div for spacing, keeps search bar centered */}
      <div></div>
    </header>
  );
};

export default Header;
