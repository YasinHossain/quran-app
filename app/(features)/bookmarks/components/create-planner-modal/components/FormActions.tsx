'use client';

import React from 'react';

import { PlusIcon } from '@/app/shared/icons';
import { Button } from '@/app/shared/ui/Button';

interface FormActionsProps {
  canSubmit: boolean;
}

export const FormActions = ({ canSubmit }: FormActionsProps): React.JSX.Element => (
  <div className="flex justify-end gap-3 pt-4">
    <Button type="button" variant="ghost" size="md" onClick={() => {}}>
      Cancel
    </Button>
    <Button
      type="submit"
      variant="primary"
      size="md"
      disabled={!canSubmit}
      className="min-w-[120px]"
    >
      <PlusIcon size={16} className="mr-2" />
      Create Plan
    </Button>
  </div>
);
