'use client';

import { AnimatePresence } from 'framer-motion';

import { ModalActions } from './modal/ModalActions';
import { ModalBackdrop } from './modal/ModalBackdrop';
import { ModalContent } from './modal/ModalContent';
import { useModalKeyboard } from './modal/useModalKeyboard';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal = ({
  isOpen,
  title = 'Delete Item',
  description = 'Are you sure you want to delete this item?',
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps): React.JSX.Element => {
  const { cancelRef } = useModalKeyboard({ isOpen, onCancel });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <ModalBackdrop onClick={onCancel} />
          <ModalContent title={title} description={description}>
            <ModalActions ref={cancelRef} onCancel={onCancel} onConfirm={onConfirm} />
          </ModalContent>
        </>
      )}
    </AnimatePresence>
  );
};
