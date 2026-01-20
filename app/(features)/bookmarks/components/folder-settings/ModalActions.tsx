import React from 'react';

import { ModalFooter } from '@/app/shared/components/modal/ModalFooter';
import { Button } from '@/app/shared/ui/Button';

interface ModalActionsProps {
  isSubmitting: boolean;
  submitLabel: string;
  submittingLabel: string;
}

export const ModalActions = ({
  isSubmitting,
  submitLabel,
  submittingLabel,
}: ModalActionsProps): React.JSX.Element => (
  <ModalFooter
    className="pt-4"
    right={
      <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
    }
  />
);
