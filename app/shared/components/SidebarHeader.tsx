'use client';
import type React from 'react';

import { CloseIcon, ArrowLeftIcon } from '@/app/shared/icons';
import { cn } from '@/lib/utils/cn';

interface SidebarHeaderProps {
  title: string;
  onClose?: () => void;
  onBack?: () => void;
  showCloseButton?: boolean;
  showBackButton?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const SidebarHeader = ({
  title,
  onClose,
  onBack,
  showCloseButton = false,
  showBackButton = false,
  className,
  children,
}: SidebarHeaderProps): JSX.Element => {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 shadow-md shadow-black/5 dark:shadow-black/10',
        showCloseButton && 'md:justify-center', // Center title on desktop when close button is only for mobile
        className
      )}
    >
      {/* Back button (left side) */}
      {showBackButton && onBack && (
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-surface-hover transition-colors"
          aria-label="Go back"
        >
          <ArrowLeftIcon size={20} className="text-foreground" />
        </button>
      )}

      {/* Title */}
      <h2
        className={cn(
          'text-lg font-semibold text-foreground',
          showBackButton && 'flex-1 text-center'
        )}
      >
        {title}
      </h2>

      {/* Close button (right side, mobile only for SurahList, always for Settings) */}
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className={cn(
            'btn-touch p-2 rounded-md hover:bg-surface/60 transition-colors',
            // Hide on desktop for navigation sidebars, always show for settings
            title === 'Settings' ? '' : 'md:hidden'
          )}
          aria-label="Close sidebar"
        >
          <CloseIcon size={18} />
        </button>
      )}

      {/* Custom content */}
      {children}

      {/* Spacer for centering when we have back button but no close button */}
      {showBackButton && !showCloseButton && <div className="w-10 h-10" aria-hidden="true" />}
    </div>
  );
};
