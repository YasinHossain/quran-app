'use client';

import { useState, useCallback, useEffect } from 'react';

interface UseModalOptions {
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  closeOnEscape?: boolean;
}

interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

/**
 * Custom hook for managing modal/panel state
 * Provides consistent modal behavior across components
 */
export function useModal(options: UseModalOptions = {}): UseModalReturn {
  const { defaultOpen = false, onOpenChange, closeOnEscape = true } = options;

  const [isOpen, setIsOpenState] = useState(defaultOpen);

  const setIsOpen = useCallback(
    (newIsOpen: boolean) => {
      setIsOpenState(newIsOpen);
      onOpenChange?.(newIsOpen);
    },
    [onOpenChange]
  );

  const open = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const toggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close, closeOnEscape]);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
}
