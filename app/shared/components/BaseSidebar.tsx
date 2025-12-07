'use client';

import React from 'react';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { cn } from '@/lib/utils/cn';

import { SidebarOverlay } from './sidebar/SidebarOverlay';
import { useSidebarPositioning } from './sidebar/useSidebarPositioning';

interface BaseSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  showOverlay?: boolean;
  desktopBreakpoint?: 'lg' | 'xl';
  'aria-label'?: string;
}

export const BaseSidebar = ({
  isOpen,
  onClose,
  position = 'left',
  children,
  className,
  showOverlay = true,
  desktopBreakpoint = 'lg',
  'aria-label': ariaLabel = 'Sidebar',
}: BaseSidebarProps): React.JSX.Element => {
  const { isHidden } = useHeaderVisibility();
  const { getPositionClasses } = useSidebarPositioning({
    position,
    isOpen,
    isHeaderHidden: isHidden,
    desktopBreakpoint,
  });

  return (
    <>
      <SidebarOverlay
        isOpen={isOpen}
        onClose={onClose}
        position={position}
        showOverlay={showOverlay}
        desktopBreakpoint={desktopBreakpoint}
      />

      <aside
        className={cn(
          getPositionClasses(),
          // Ensure we don't override fixed positioning from getPositionClasses
          'text-foreground flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom,0px)] touch-pan-y lg:overflow-visible lg:pb-0',
          className
        )}
        role="dialog"
        aria-label={ariaLabel}
        aria-modal={isOpen}
      >
        {children}
      </aside>
    </>
  );
};
