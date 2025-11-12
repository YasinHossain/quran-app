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
  withShadow?: boolean;
  // When true, render an edge-to-edge container so borders can span full width
  // while keeping padded content inside. Useful for sidebar headers that need
  // the divider line to touch the sidebar edges.
  edgeToEdge?: boolean;
  // Optional class for the inner content wrapper (padding/height tweaks)
  contentClassName?: string;
  containerContentClassName?: string;
  children?: React.ReactNode;
  backButtonClassName?: string;
  closeButtonClassName?: string;
  backButtonAriaLabel?: string;
  titleAlign?: 'auto' | 'left' | 'center';
  titleClassName?: string;
}

const BackButton = ({
  onBack,
  className,
  ariaLabel = 'Go back',
}: {
  onBack: () => void;
  className?: string;
  ariaLabel?: string;
}): React.JSX.Element => (
  <button
    onClick={onBack}
    className={cn('btn-touch p-2 rounded-full hover:bg-surface-hover transition-colors', className)}
    aria-label={ariaLabel}
  >
    <ArrowLeftIcon size={20} className="text-foreground" />
  </button>
);

const CloseButton = ({
  onClose,
  alwaysShow,
  className,
}: {
  onClose: () => void;
  alwaysShow: boolean;
  className?: string;
}): React.JSX.Element => (
  <button
    onClick={onClose}
    className={cn(
      'btn-touch p-2 rounded-md hover:bg-surface/60 transition-colors',
      alwaysShow ? '' : 'md:hidden',
      className
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
  withShadow = true,
  edgeToEdge = false,
  contentClassName,
  containerContentClassName,
  children,
  backButtonClassName,
  closeButtonClassName,
  backButtonAriaLabel,
  titleAlign = 'auto',
  titleClassName,
}: SidebarHeaderProps): React.JSX.Element => {
  const alwaysShowClose = title === 'Settings';

  const paddedContent = cn('px-3 sm:px-4 py-3 sm:py-4', contentClassName);
  const containerClass = cn(
    'relative w-full',
    withShadow && 'shadow-card',
    edgeToEdge
      ? cn('px-0', containerContentClassName)
      : cn('px-3 sm:px-4 py-3 sm:py-4', containerContentClassName),
    className
  );
  let backButton: React.JSX.Element | null = null;
  if (showBackButton && onBack) {
    backButton = (
      <BackButton
        onBack={onBack}
        {...(backButtonClassName !== undefined ? { className: backButtonClassName } : {})}
        {...(backButtonAriaLabel !== undefined ? { ariaLabel: backButtonAriaLabel } : {})}
      />
    );
  }

  let closeButton: React.JSX.Element | null = null;
  if (showCloseButton && onClose) {
    closeButton = (
      <CloseButton
        onClose={onClose}
        alwaysShow={alwaysShowClose}
        {...(closeButtonClassName !== undefined ? { className: closeButtonClassName } : {})}
      />
    );
  }

  const hasChildren = React.Children.count(children) > 0;
  const hasRightControls = Boolean(closeButton) || hasChildren;
  const innerClass = cn(
    'relative flex w-full items-center justify-center',
    edgeToEdge ? paddedContent : undefined,
    !edgeToEdge && contentClassName ? contentClassName : undefined
  );
  const computedAlign =
    titleAlign === 'center'
      ? 'text-center'
      : titleAlign === 'left'
        ? 'text-left'
        : showBackButton || hasRightControls
          ? 'text-center'
          : 'text-left';
  const titleClass = cn(
    'w-full text-lg font-semibold text-foreground',
    computedAlign,
    titleClassName
  );

  const content = (
    <div className={innerClass}>
      {backButton ? (
        <div className="absolute inset-y-0 left-0 flex items-center">{backButton}</div>
      ) : null}
      <h2 className={titleClass}>{title}</h2>
      {hasRightControls ? (
        <div className="absolute inset-y-0 right-0 flex items-center gap-2">
          {closeButton}
          {children}
        </div>
      ) : null}
    </div>
  );

  return <div className={containerClass}>{content}</div>;
};
