'use client';

import React from 'react';

import { CloseIcon, ArrowLeftIcon } from '@/app/shared/icons';
import { cn } from '@/lib/utils/cn';

interface SidebarHeaderProps {
  title: string;
  onClose?: () => void;
  onBack?: () => void;
  showCloseButton?: boolean;
  showBackButton?: boolean;
  className?: string;
  withShadow?: boolean; // Deprecated but kept for compatibility
  edgeToEdge?: boolean; // Deprecated but kept for compatibility
  contentClassName?: string; // Deprecated but kept for compatibility
  containerContentClassName?: string; // Deprecated but kept for compatibility
  children?: React.ReactNode;
  backButtonClassName?: string;
  closeButtonClassName?: string;
  backButtonAriaLabel?: string;
  titleAlign?: 'auto' | 'left' | 'center'; // Deprecated, forced to center
  titleClassName?: string;
  forceVisible?: boolean;
}

export const SidebarHeader = ({
  title,
  onClose,
  onBack,
  showCloseButton = false,
  showBackButton = false,
  className,
  children,
  titleClassName,
  forceVisible = false,
}: SidebarHeaderProps): React.JSX.Element => {
  return (
    <div
      className={cn(
        // Layout & Sizing
        'flex items-center justify-between w-full h-14 shrink-0 pb-1',
        // Spacing
        'px-4',
        // Visuals
        'border-b border-border bg-background',
        // Visibility: Mobile only (hidden on desktop) unless forced
        !forceVisible && 'md:hidden',
        className
      )}
    >
      {/* Left Section: Back Button */}
      <div className="flex items-center justify-start min-w-[40px]">
        {showBackButton && onBack ? (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-surface-hover transition-colors text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            aria-label="Go back"
          >
            <ArrowLeftIcon size={20} />
          </button>
        ) : null}
      </div>

      {/* Center Section: Title */}
      <div className="flex-1 flex items-center justify-center px-2 overflow-hidden">
        <h2
          className={cn(
            'text-lg font-semibold text-foreground text-center truncate',
            titleClassName
          )}
        >
          {title}
        </h2>
      </div>

      {/* Right Section: Close Button & Children */}
      <div className="flex items-center justify-end min-w-[40px] gap-1">
        {children}
        {showCloseButton && onClose ? (
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-surface-hover transition-colors text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            aria-label="Close sidebar"
          >
            <CloseIcon size={20} />
          </button>
        ) : null}
      </div>
    </div>
  );
};
