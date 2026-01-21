'use client';

import React, { memo, useCallback, useEffect, useState } from 'react';

import { Portal } from '@/app/shared/components/Portal';
import { useBodyScrollLock } from '@/app/shared/hooks/useBodyScrollLock';

import { UnifiedModalBackdrop, UnifiedModalFrame, useCloseOnEscape } from './UnifiedModalParts';

// Duration for exit animation (matches CSS)
const EXIT_ANIMATION_MS = 200;

export interface UnifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  contentClassName?: string;
  backdropClassName?: string;
  containerClassName?: string;
  layerClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  role?: 'dialog' | 'alertdialog';
}

export const UnifiedModal = memo(function UnifiedModal({
  isOpen,
  onClose,
  children,
  contentClassName,
  backdropClassName,
  containerClassName,
  layerClassName = 'z-modal',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  role = 'dialog',
}: UnifiedModalProps): React.JSX.Element | null {
  // Track whether we should render the modal (for exit animations)
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isExiting, setIsExiting] = useState(false);

  useCloseOnEscape(isOpen && closeOnEscape, onClose);
  useBodyScrollLock(shouldRender);

  // Handle open/close state changes
  useEffect(() => {
    if (isOpen) {
      // Opening - render immediately
      setShouldRender(true);
      setIsExiting(false);
      return undefined;
    }
    if (shouldRender) {
      // Closing - trigger exit animation
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsExiting(false);
      }, EXIT_ANIMATION_MS);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOpen, shouldRender]);

  const handleBackdropClick = useCallback((): void => {
    if (closeOnOverlayClick) onClose();
  }, [closeOnOverlayClick, onClose]);

  if (!shouldRender) return null;

  return (
    <Portal>
      <UnifiedModalBackdrop
        onClick={handleBackdropClick}
        layerClassName={layerClassName}
        className={backdropClassName}
        isExiting={isExiting}
      />
      <UnifiedModalFrame
        layerClassName={layerClassName}
        className={contentClassName}
        containerClassName={containerClassName}
        ariaLabel={ariaLabel}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        role={role}
        isExiting={isExiting}
      >
        {children}
      </UnifiedModalFrame>
    </Portal>
  );
});
