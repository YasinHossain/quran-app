'use client';

import React, { useEffect, useMemo, useState } from 'react';

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
  desktopBreakpoint?: 'lg' | 'xl' | '2xl';
  'aria-label'?: string;
}

const getDesktopMinWidth = (desktopBreakpoint: 'lg' | 'xl' | '2xl'): number => {
  if (desktopBreakpoint === 'xl') return 1280;
  if (desktopBreakpoint === '2xl') return 1536;
  return 1024;
};

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
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const { getPositionClasses } = useSidebarPositioning({
    position,
    isOpen,
    isHeaderHidden: isHidden,
    desktopBreakpoint,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const minWidth = getDesktopMinWidth(desktopBreakpoint);
    const mediaQuery = window.matchMedia(`(min-width: ${minWidth}px)`);

    const syncPinned = (): void => {
      setIsPinnedOpen(mediaQuery.matches);
    };

    syncPinned();
    mediaQuery.addEventListener('change', syncPinned);

    return () => {
      mediaQuery.removeEventListener('change', syncPinned);
    };
  }, [desktopBreakpoint]);

  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === 'undefined') return;

    const minWidth = getDesktopMinWidth(desktopBreakpoint);
    const mediaQuery = window.matchMedia(`(min-width: ${minWidth}px)`);
    const root = document.documentElement;
    const body = document.body;
    const lockClass = 'sidebar-scroll-lock';

    const syncScrollLock = (): void => {
      if (mediaQuery.matches) {
        root.classList.remove(lockClass);
        body.classList.remove(lockClass);
        return;
      }
      root.classList.add(lockClass);
      body.classList.add(lockClass);
    };

    syncScrollLock();
    mediaQuery.addEventListener('change', syncScrollLock);

    return () => {
      mediaQuery.removeEventListener('change', syncScrollLock);
      root.classList.remove(lockClass);
      body.classList.remove(lockClass);
    };
  }, [desktopBreakpoint, isOpen]);

  const desktopOverflowClass =
    desktopBreakpoint === 'lg'
      ? 'lg:overflow-visible lg:pb-0'
      : desktopBreakpoint === 'xl'
        ? 'xl:overflow-visible xl:pb-0'
        : '2xl:overflow-visible 2xl:pb-0';

  const shouldRenderContent = useMemo(() => isOpen || isPinnedOpen, [isOpen, isPinnedOpen]);

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
          'text-foreground flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom,0px)] touch-pan-y',
          desktopOverflowClass,
          className
        )}
        role="dialog"
        aria-label={ariaLabel}
        aria-modal={isOpen}
      >
        {shouldRenderContent ? children : null}
      </aside>
    </>
  );
};
