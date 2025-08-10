// app/components/IconSidebar.tsx
'use client';
import { FaHome, FaRegBookmark, FaTh } from './SvgIcons';
import { useTranslation } from 'react-i18next';
import Link from 'next/link'; // Import Link

const IconSidebar = () => {
  const { t } = useTranslation();
  const navItems = [
    { icon: FaHome, label: t('home'), href: '/' },
    { icon: FaTh, label: t('all_surahs'), href: '/features/surah/1' },
    { icon: FaRegBookmark, label: t('bookmarks'), href: '/bookmarks' },
  ];

  return (
    // CHANGE: Removed the border-r class for a cleaner look and centered content vertically
    // Added h-full to make the sidebar take full height for vertical centering
    <aside className="w-20 bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-center py-4 h-full overflow-x-hidden">
      <nav className="flex flex-col items-center space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            aria-label={item.label}
            className="p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-[var(--foreground)] hover:text-teal-600 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 border-0"
          >
            <item.icon className="h-6 w-6" />
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default IconSidebar;
