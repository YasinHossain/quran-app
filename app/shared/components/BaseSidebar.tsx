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
  'aria-label'?: string;
}

export const BaseSidebar = ({
  isOpen,
  onClose,
  position = 'left',
  children,
  className,
  showOverlay = true,
  'aria-label': ariaLabel = 'Sidebar',
}: BaseSidebarProps): React.JSX.Element => {
  const { isHidden } = useHeaderVisibility();
  const { getPositionClasses } = useSidebarPositioning({
    position,
    isOpen,
    isHeaderHidden: isHidden,
  });

  return (
    <>
      <SidebarOverlay
        isOpen={isOpen}
        onClose={onClose}
        position={position}
        showOverlay={showOverlay}
      />

      <aside
        className={cn(
          getPositionClasses(),
          // Ensure we don't override fixed positioning from getPositionClasses
          'text-foreground flex flex-col overflow-hidden pt-safe pb-safe touch-pan-y lg:overflow-visible lg:pt-0 lg:pb-0',
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
