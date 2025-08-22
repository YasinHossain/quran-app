'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useResponsiveState } from '@/lib/responsive';
import { cn } from '@/lib/utils';
import AdaptiveNavigation from './AdaptiveNavigation';

interface AdaptiveLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  sidebarContent?: React.ReactNode;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
}

/**
 * Unified layout that adapts to any screen size
 * Replaces the need for separate mobile/desktop layouts
 */
const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({
  children,
  showNavigation = true,
  sidebarContent,
  sidebarOpen = false,
  onSidebarToggle,
}) => {
  const { variant } = useResponsiveState();

  // Handle navigation visibility
  const handleSurahJump = () => {
    // Implementation for surah jump functionality
    console.log('Surah jump triggered');
  };

  // Adaptive content padding based on navigation presence
  const getContentPadding = () => {
    if (!showNavigation) return '';

    switch (variant) {
      case 'compact':
        return 'bottom-nav-space'; // Mobile bottom nav height
      case 'default':
        return 'bottom-nav-space'; // Tablet also uses bottom nav
      case 'expanded':
        return ''; // Desktop has no fixed navigation
      default:
        return 'bottom-nav-space';
    }
  };

  // Adaptive sidebar positioning
  const getSidebarClasses = () => {
    if (!sidebarContent) return '';

    const baseClasses = 'bg-surface border-border shadow-modal transition-transform duration-300';

    switch (variant) {
      case 'compact':
        return cn(
          baseClasses,
          'fixed bottom-0 left-0 right-0 max-h-[70dvh] rounded-t-2xl border-t',
          sidebarOpen ? 'translate-y-0' : 'translate-y-full'
        );

      case 'default':
        return cn(
          baseClasses,
          'fixed top-16 right-0 bottom-0 w-80 border-l rounded-tl-2xl',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        );

      case 'expanded':
        return cn(
          baseClasses,
          'static w-80 h-full border rounded-xl',
          sidebarOpen ? 'block' : 'hidden'
        );

      default:
        return baseClasses;
    }
  };

  return (
    <div className="relative min-h-[100dvh] bg-background">
      {/* Backdrop for mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && variant === 'compact' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onSidebarToggle}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Main layout container */}
      <div className={cn('flex', variant === 'expanded' ? 'flex-row' : 'flex-col')}>
        {/* Main content */}
        <main className={cn('flex-1 min-w-0', getContentPadding())}>{children}</main>

        {/* Adaptive sidebar */}
        {sidebarContent && (
          <aside className={cn(getSidebarClasses(), 'z-50')}>{sidebarContent}</aside>
        )}
      </div>

      {/* Adaptive navigation */}
      {showNavigation && <AdaptiveNavigation onSurahJump={handleSurahJump} />}
    </div>
  );
};

export default AdaptiveLayout;
