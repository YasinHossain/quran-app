'use client';

import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

interface ModalActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmVariant?: 'error' | 'primary';
}

export const ModalActions = forwardRef<HTMLButtonElement, ModalActionsProps>(
  (
    {
      onCancel,
      onConfirm,
      cancelText: cancelTextProp,
      confirmText: confirmTextProp,
      confirmVariant = 'error',
    },
    ref
  ) => {
    const { t } = useTranslation();
    const cancelText = cancelTextProp ?? t('cancel');
    const confirmText = confirmTextProp ?? t('delete');
    const confirmButtonClasses =
      confirmVariant === 'error'
        ? 'bg-error text-on-error hover:bg-error/90'
        : 'bg-primary text-on-primary hover:bg-primary/90';

    return (
      <div className="flex justify-end gap-3">
        <button
          ref={ref}
          onClick={onCancel}
          aria-label={cancelText}
          className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-interactive-hover rounded-lg transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          aria-label={confirmText}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${confirmButtonClasses}`}
        >
          {confirmText}
        </button>
      </div>
    );
  }
);

ModalActions.displayName = 'ModalActions';
