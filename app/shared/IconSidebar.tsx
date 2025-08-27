// app/components/IconSidebar.tsx
'use client';
import { Home, Bookmark, Grid3X3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link'; // Import Link

const IconSidebar = () => {
  const { t } = useTranslation();
  const navItems = [
    { icon: Home, label: t('home'), href: '/' },
    { icon: Grid3X3, label: t('all_surahs'), href: '/surah/1' },
    { icon: Bookmark, label: t('bookmarks'), href: '/bookmarks' },
  ];

  return (
    // CHANGE: Removed the border-r class for a cleaner look and centered content vertically
    // Added h-full to make the sidebar take full height for vertical centering
    <aside className="w-16 bg-background text-foreground flex flex-col justify-center py-4 h-full overflow-x-hidden">
      <nav className="flex flex-col items-center space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            aria-label={item.label}
            className="p-3 rounded-lg hover:bg-accent/10 text-foreground hover:text-accent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent border-0"
          >
            <item.icon className="h-6 w-6" />
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default IconSidebar;
