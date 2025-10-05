'use client';

import React from 'react';

import { PlusIcon } from '@/app/shared/icons';
import { Button } from '@/app/shared/ui/Button';

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitDisabled: boolean;
}

export const FormActions = ({
  onCancel,
  onSubmit,
  isSubmitDisabled,
}: FormActionsProps): React.JSX.Element => (
  <div className="flex justify-end gap-3 pt-2">
    <Button variant="ghost" onClick={onCancel} className="px-6 py-2.5">
      Cancel
    </Button>
    <Button
      type="submit"
      variant="primary"
      disabled={isSubmitDisabled}
      onClick={onSubmit}
      className="px-6 py-2.5 flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      <PlusIcon size={18} />
      <span>Create Folder</span>
    </Button>
  </div>
);
