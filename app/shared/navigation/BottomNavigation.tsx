'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { IconHome, IconBook, IconBookmark } from '@tabler/icons-react';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';

interface NavItem {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href?: string;
  badge?: number;
}

interface BottomNavigationProps {
  onSurahJump?: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onSurahJump }) => {
  const pathname = usePathname();
  const { isHidden } = useHeaderVisibility();

  const navItems: NavItem[] = [
    {
      id: 'home',
      icon: IconHome,
      label: 'Home',
      href: '/',
    },
    {
      id: 'surah',
      icon: IconBook,
      label: 'Surah',
    },
    {
      id: 'bookmarks',
      icon: IconBookmark,
      label: 'Bookmarks',
      href: '/bookmarks',
    },
  ];

  const isActive = (href: string | undefined, id: string) => {
    if (href === '/' && pathname === '/') return true;
    if (id === 'surah' && pathname.startsWith('/surah')) return true;
    if (href === '/bookmarks' && pathname.startsWith('/bookmarks')) return true;
    return pathname === href;
  };

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-bottom-nav lg:hidden transition-transform duration-300 ease-in-out ${
        isHidden ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* Glass effect backdrop - matching header design */}
      <div className="absolute inset-0 backdrop-blur-lg bg-white/8 dark:bg-gray-900/8 backdrop-saturate-150 border-t border-white/5 dark:border-white/5" />

      {/* Safe area for iPhone - more compact */}
      <div className="relative px-4 pt-1.5 pb-safe pl-safe pr-safe">
        <div className="flex items-center justify-around max-w-sm mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.id);

            const commonProps = {
              className:
                'relative flex flex-col items-center justify-center min-w-[48px] py-1.5 px-2 rounded-xl transition-all duration-200 hover:bg-muted/60 active:scale-95 touch-manipulation',
            };

            const content = (
              <>
                {/* Icon container - more compact */}
                <div className="relative z-10 mb-0.5">
                  <Icon
                    size={20}
                    className={`transition-all duration-200 ${
                      active ? 'text-foreground stroke-[2.5]' : 'text-muted-foreground stroke-[2]'
                    }`}
                  />

                  {/* Badge */}
                  {item.badge && item.badge > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 min-w-[16px] h-[16px] bg-status-error text-white text-xs font-semibold rounded-full flex items-center justify-center"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </motion.div>
                  )}
                </div>

                {/* Label - smaller and more subtle */}
                <span
                  className={`text-xs font-medium transition-all duration-200 ${
                    active ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </>
            );

            if (item.id === 'surah') {
              return (
                <button key={item.id} type="button" onClick={onSurahJump} {...commonProps}>
                  {content}
                </button>
              );
            }

            return (
              <Link key={item.id} href={item.href!} {...commonProps}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
