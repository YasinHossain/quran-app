'use client';

import type { JSX } from 'react';

import { useResponsiveState } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

import { LayoutBackdrop } from './LayoutBackdrop';
import { useLayoutStyles } from './useLayoutStyles';

interface LayoutContentProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
  showNavigation?: boolean;
}

export function LayoutContent({
  children,
  sidebarContent,
  sidebarOpen = false,
  onSidebarToggle,
  showNavigation = true,
}: LayoutContentProps): JSX.Element {
  const { variant } = useResponsiveState();

  const { getContentPadding, getSidebarClasses, getContainerClasses } = useLayoutStyles({
    variant,
    showNavigation,
    sidebarOpen,
    hasSidebar: Boolean(sidebarContent),
  });

  return (
    <>
      <LayoutBackdrop
        show={sidebarOpen && variant === 'compact'}
        {...(onSidebarToggle ? { onClose: onSidebarToggle } : {})}
      />

      <div className={getContainerClasses()}>
        <main className={cn('flex-1 min-w-0', getContentPadding())}>{children}</main>

        {sidebarContent && (
          <aside className={cn(getSidebarClasses(), 'z-50')}>{sidebarContent}</aside>
        )}
      </div>
    </>
  );
}
