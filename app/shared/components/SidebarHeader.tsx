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
  children?: React.ReactNode;
}

const BackButton = ({ onBack }: { onBack: () => void }): React.JSX.Element => (
  <button
    onClick={onBack}
    className="p-2 rounded-full hover:bg-surface-hover transition-colors"
    aria-label="Go back"
  >
    <ArrowLeftIcon size={20} className="text-foreground" />
  </button>
);

const CloseButton = ({
  onClose,
  alwaysShow,
}: {
  onClose: () => void;
  alwaysShow: boolean;
}): React.JSX.Element => (
  <button
    onClick={onClose}
    className={cn(
      'btn-touch p-2 rounded-md hover:bg-surface/60 transition-colors',
      alwaysShow ? '' : 'md:hidden'
    )}
    aria-label="Close sidebar"
  >
    <CloseIcon size={18} />
  </button>
);

export const SidebarHeader = ({
  title,
  onClose,
  onBack,
  showCloseButton = false,
  showBackButton = false,
  className,
  children,
}: SidebarHeaderProps): React.JSX.Element => {
  const shouldShowBack = Boolean(showBackButton && onBack);
  const shouldShowClose = Boolean(showCloseButton && onClose);
  const alwaysShowClose = title === 'Settings';

  const containerClass = cn(
    'flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 shadow-card',
    showCloseButton && 'md:justify-center',
    className
  );

  return (
    <div className={containerClass}>
      {shouldShowBack && onBack ? <BackButton onBack={onBack} /> : null}

      <h2
        className={cn(
          'text-lg font-semibold text-foreground',
          showBackButton && 'flex-1 text-center'
        )}
      >
        {title}
      </h2>

      {shouldShowClose && onClose ? (
        <CloseButton onClose={onClose} alwaysShow={alwaysShowClose} />
      ) : null}

      {children}

      {showBackButton && !showCloseButton ? <div className="w-10 h-10" aria-hidden="true" /> : null}
    </div>
  );
};
