import { forwardRef } from 'react';

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
      cancelText = 'Cancel',
      confirmText = 'Delete',
      confirmVariant = 'error',
    },
    ref
  ) => {
    const confirmButtonClasses =
      confirmVariant === 'error'
        ? 'bg-error text-on-error hover:bg-error/90'
        : 'bg-primary text-on-primary hover:bg-primary/90';

    return (
      <div className="flex justify-end gap-3">
        <button
          ref={ref}
          onClick={onCancel}
          aria-label={`Cancel ${confirmText.toLowerCase()}`}
          className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          aria-label={`Confirm ${confirmText.toLowerCase()}`}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${confirmButtonClasses}`}
        >
          {confirmText}
        </button>
      </div>
    );
  }
);

ModalActions.displayName = 'ModalActions';
