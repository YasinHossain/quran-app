'use client';

import React from 'react';

import { ModalFooter } from '@/app/shared/components/modal/ModalFooter';
import { PlusIcon } from '@/app/shared/icons';
import { Button } from '@/app/shared/ui/Button';

interface FormActionsProps {
  canSubmit: boolean;
  formId?: string;
}

export const FormActions = ({ canSubmit, formId }: FormActionsProps): React.JSX.Element => (
  <ModalFooter
    className="pt-4"
    right={
      <Button
        type="submit"
        {...(formId ? { form: formId } : {})}
        variant="primary"
        size="md"
        disabled={!canSubmit}
        className="min-w-[120px]"
      >
        <PlusIcon size={16} className="mr-2" />
        Create Plan
      </Button>
    }
  />
);
