'use client';

import React from 'react';

import { ModalFooter } from '@/app/shared/components/modal/ModalFooter';
import { Button } from '@/app/shared/ui/Button';

interface ModalActionsProps {
  onDelete: () => void;
  isDeleting: boolean;
}

export const ModalActions = ({
  onDelete,
  isDeleting,
}: ModalActionsProps): React.JSX.Element => (
  <div className="mt-8 pt-6 border-t border-border/60">
    <ModalFooter
      right={
        <Button
          type="button"
          onClick={onDelete}
          isLoading={isDeleting}
          variant="destructive"
          aria-label="Confirm delete folder"
        >
          {isDeleting ? 'Deleting...' : 'Delete Forever'}
        </Button>
      }
    />
  </div>
);
