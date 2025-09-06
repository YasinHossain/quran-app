import React from 'react';

interface ModalActionsProps {
  isSubmitting: boolean;
  onClose: () => void;
}

export const ModalActions = ({ isSubmitting, onClose }: ModalActionsProps): React.JSX.Element => (
  <div className="flex justify-end gap-3 pt-4">
    <button
      type="button"
      onClick={onClose}
      className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
      disabled={isSubmitting}
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isSubmitting}
      className="px-4 py-2 bg-accent text-on-accent rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? 'Saving...' : 'Save Changes'}
    </button>
  </div>
);
