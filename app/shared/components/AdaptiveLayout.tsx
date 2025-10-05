'use client';

import React from 'react';

import { LayoutContent } from './adaptive-layout/LayoutContent';

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
export const AdaptiveLayout = ({
  children,
  showNavigation = true,
  sidebarContent,
  sidebarOpen = false,
  onSidebarToggle,
}: AdaptiveLayoutProps): React.JSX.Element => {
  // Navigation interactions are handled by higher-level components/contexts

  return (
    <div className="relative min-h-[100dvh] bg-background">
      <LayoutContent
        showNavigation={showNavigation}
        sidebarContent={sidebarContent}
        sidebarOpen={sidebarOpen}
        {...(onSidebarToggle ? { onSidebarToggle } : {})}
      >
        {children}
      </LayoutContent>

      {/* Navigation handled elsewhere (IconSidebar responsive) */}
    </div>
  );
};
