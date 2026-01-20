'use client';

import { AnimatePresence } from 'framer-motion';
import React, { memo, useCallback } from 'react';

import { Portal } from '@/app/shared/components/Portal';
import { useBodyScrollLock } from '@/app/shared/hooks/useBodyScrollLock';

import { UnifiedModalBackdrop, UnifiedModalFrame, useCloseOnEscape } from './UnifiedModalParts';

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
}: UnifiedModalProps): React.JSX.Element {
  useCloseOnEscape(isOpen && closeOnEscape, onClose);
  useBodyScrollLock(isOpen);

  const handleBackdropClick = useCallback((): void => {
    if (closeOnOverlayClick) onClose();
  }, [closeOnOverlayClick, onClose]);

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <>
            <UnifiedModalBackdrop
              onClick={handleBackdropClick}
              layerClassName={layerClassName}
              className={backdropClassName}
            />
            <UnifiedModalFrame
              layerClassName={layerClassName}
              className={contentClassName}
              containerClassName={containerClassName}
              ariaLabel={ariaLabel}
              ariaLabelledBy={ariaLabelledBy}
              ariaDescribedBy={ariaDescribedBy}
              role={role}
            >
              {children}
            </UnifiedModalFrame>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
});
