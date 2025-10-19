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
  // When true, render an edge-to-edge container so borders can span full width
  // while keeping padded content inside. Useful for sidebar headers that need
  // the divider line to touch the sidebar edges.
  edgeToEdge?: boolean;
  // Optional class for the inner content wrapper (padding/height tweaks)
  contentClassName?: string;
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
  edgeToEdge = false,
  contentClassName,
  children,
}: SidebarHeaderProps): React.JSX.Element => {
  const alwaysShowClose = title === 'Settings';

  const baseContainer = 'flex items-center justify-between';
  const paddedContent = cn('px-3 sm:px-4 py-3 sm:py-4', contentClassName);
  const containerClass = cn(
    baseContainer,
    edgeToEdge ? 'px-0' : 'px-3 sm:px-4',
    edgeToEdge ? undefined : 'py-3 sm:py-4',
    'shadow-card',
    showCloseButton && 'md:justify-center',
    className
  );
  let backButton: React.JSX.Element | null = null;
  let placeholder: React.JSX.Element | null = null;
  if (showBackButton) {
    if (onBack) {
      backButton = <BackButton onBack={onBack} />;
    }
    if (!showCloseButton) {
      placeholder = <div className="w-10 h-10" aria-hidden="true" />;
    }
  }

  let closeButton: React.JSX.Element | null = null;
  if (showCloseButton && onClose) {
    closeButton = <CloseButton onClose={onClose} alwaysShow={alwaysShowClose} />;
  }

  const content = (
    <>
      {backButton}
      <h2
        className={cn(
          'text-lg font-semibold text-foreground',
          showBackButton ? 'flex-1 text-center' : undefined
        )}
      >
        {title}
      </h2>
      {closeButton}
      {children}
      {placeholder}
    </>
  );

  if (edgeToEdge) {
    return (
      <div className={containerClass}>
        <div className={cn(baseContainer, paddedContent, showCloseButton && 'md:justify-center')}>
          {content}
        </div>
      </div>
    );
  }

  return <div className={containerClass}>{content}</div>;
};
