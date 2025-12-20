import React from 'react';

interface ModalActionsProps {
  isSubmitting: boolean;
  onClose: () => void;
  submitLabel: string;
  submittingLabel: string;
}

export const ModalActions = ({
  isSubmitting,
  onClose,
  submitLabel,
  submittingLabel,
}: ModalActionsProps): React.JSX.Element => (
  <div className="flex justify-end gap-3 pt-4">

    <button
      type="submit"
      disabled={isSubmitting}
      className="px-4 py-2 bg-accent text-on-accent rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus-visible:ring-2 focus-visible:ring-accent/30 focus:outline-none"
    >
      {isSubmitting ? submittingLabel : submitLabel}
    </button>
  </div>
);
