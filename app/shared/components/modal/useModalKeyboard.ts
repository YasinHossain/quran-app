import { useEffect, useRef } from 'react';

interface UseModalKeyboardOptions {
  isOpen: boolean;
  onCancel: () => void;
}

export const useModalKeyboard = ({ isOpen, onCancel }: UseModalKeyboardOptions) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      cancelRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  return { cancelRef };
};
