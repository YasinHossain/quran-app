'use client';

import React from 'react';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { cn } from '@/lib/utils/cn';

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

  // Calculate positioning based on header visibility and position
  const getPositionClasses = () => {
    const baseClasses =
      'fixed w-full sm:w-80 lg:w-[20.7rem] bg-background transition-all duration-300 ease-in-out';

    if (position === 'left') {
      return cn(
        baseClasses,
        'left-0 lg:left-16',
        'shadow-modal',
        isHidden ? 'top-0 h-screen' : 'top-16 h-[calc(100vh-4rem)]',
        'z-50 lg:z-10',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      );
    } else {
      return cn(
        baseClasses,
        'right-0',
        'shadow-modal',
        isHidden ? 'top-0 h-screen' : 'top-16 h-[calc(100vh-4rem)]',
        'z-30',
        isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      );
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {showOverlay && isOpen && (
        <div
          className={cn(
            'fixed inset-0 transition-opacity duration-300',
            position === 'left'
              ? 'bg-surface-overlay/50 lg:hidden z-40'
              : 'bg-surface-overlay/20 lg:hidden z-25'
          )}
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClose();
            }
          }}
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          getPositionClasses(),
          'text-foreground flex flex-col overflow-x-hidden pt-safe pb-safe touch-pan-y',
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
