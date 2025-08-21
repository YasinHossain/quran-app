'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { HomeIcon, GridIcon, BookmarkOutlineIcon } from './icons';

const MobileNav = () => {
  const { t } = useTranslation();
  const navItems = [
    { icon: HomeIcon, label: t('home'), href: '/' },
    { icon: GridIcon, label: t('all_surahs'), href: '/surah/1' },
    { icon: BookmarkOutlineIcon, label: t('bookmarks'), href: '/bookmarks' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background text-foreground border-t border-border flex items-center justify-around md:hidden">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          title={item.label}
          aria-label={item.label}
          className="p-3 hover:text-accent transition-colors duration-200"
        >
          <item.icon className="h-6 w-6" />
        </Link>
      ))}
    </nav>
  );
};

export default MobileNav;
