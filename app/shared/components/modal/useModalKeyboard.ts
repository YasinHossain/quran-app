import { useEffect, useRef } from 'react';

interface UseModalKeyboardOptions {
  isOpen: boolean;
  onCancel: () => void;
}

interface UseModalKeyboardResult {
  cancelRef: React.MutableRefObject<HTMLButtonElement | null>;
}

export const useModalKeyboard = ({
  isOpen,
  onCancel,
}: UseModalKeyboardOptions): UseModalKeyboardResult => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect((): void => {
    if (isOpen) {
      cancelRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  return { cancelRef };
};
