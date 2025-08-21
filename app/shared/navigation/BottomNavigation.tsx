'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { IconHome, IconBook, IconBookmark } from '@tabler/icons-react';

interface NavItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  badge?: number;
}

interface BottomNavigationProps {
  onSurahJump?: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onSurahJump }) => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      id: 'home',
      icon: IconHome,
      label: 'Home',
      href: '/home',
    },
    {
      id: 'surah',
      icon: IconBook,
      label: 'Jump to',
      href: '#', // Will be handled by onPress
    },
    {
      id: 'bookmarks',
      icon: IconBookmark,
      label: 'Bookmarks',
      href: '/bookmarks',
    },
  ];

  const isActive = (href: string, id: string) => {
    if (href === '/home' && pathname === '/') return true;
    if (id === 'surah' && pathname.startsWith('/surah')) return true;
    if (href === '/bookmarks' && pathname.startsWith('/bookmarks')) return true;
    return pathname === href;
  };

  const handleJumpClick = (e: React.MouseEvent) => {
    if (onSurahJump) {
      e.preventDefault();
      onSurahJump();
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Glass effect backdrop */}
      <div className="absolute inset-0 bg-surface-glass/95 backdrop-blur-xl border-t border-border/20" />

      {/* Safe area for iPhone */}
      <div className="relative px-2 pt-2 pb-safe">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.id);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={item.id === 'surah' ? handleJumpClick : undefined}
                className="relative flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-2xl transition-all duration-200 hover:bg-interactive/50 active:scale-95"
                style={{ touchAction: 'manipulation' }}
              >
                {/* Active indicator background */}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-accent/10 rounded-2xl"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}

                {/* Icon container */}
                <div className="relative z-10 mb-1">
                  <Icon
                    size={24}
                    className={`transition-all duration-200 ${
                      active ? 'text-accent stroke-[2.5]' : 'text-muted stroke-[2]'
                    }`}
                  />

                  {/* Badge */}
                  {item.badge && item.badge > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-status-error text-white text-xs font-semibold rounded-full flex items-center justify-center"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </motion.div>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-xs font-medium transition-all duration-200 ${
                    active ? 'text-accent' : 'text-muted'
                  }`}
                >
                  {item.label}
                </span>

                {/* Active dot indicator */}
                {active && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -bottom-1 w-1 h-1 bg-accent rounded-full"
                    transition={{
                      delay: 0.1,
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
