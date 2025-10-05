'use client';

import React from 'react';

const LoadingSpinner = (): React.JSX.Element => (
  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

interface ModalActionsProps {
  onClose: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export const ModalActions = ({
  onClose,
  onDelete,
  isDeleting,
}: ModalActionsProps): React.JSX.Element => (
  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
    <button
      onClick={onClose}
      className="px-6 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:bg-surface-hover rounded-xl transition-all duration-200"
    >
      Cancel
    </button>
    <button
      onClick={onDelete}
      disabled={isDeleting}
      className="px-6 py-2.5 text-sm font-semibold bg-error text-on-error rounded-xl hover:bg-error/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2"
    >
      {isDeleting ? (
        <>
          <LoadingSpinner />
          <span>Deleting...</span>
        </>
      ) : (
        'Delete Forever'
      )}
    </button>
  </div>
);
