'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { ModalFooter } from '@/app/shared/components/modal/ModalFooter';
import { Button } from '@/app/shared/ui/Button';

interface ModalActionsProps {
  onDelete: () => void;
  isDeleting: boolean;
}

export const ModalActions = ({ onDelete, isDeleting }: ModalActionsProps): React.JSX.Element => (
  <ModalActionsInner onDelete={onDelete} isDeleting={isDeleting} />
);

const ModalActionsInner = ({ onDelete, isDeleting }: ModalActionsProps): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="mt-8 pt-6 border-t border-border/60">
      <ModalFooter
        right={
          <Button
            type="button"
            onClick={onDelete}
            isLoading={isDeleting}
            variant="destructive"
            aria-label={t('confirm_delete_folder_aria')}
          >
            {isDeleting ? t('deleting') : t('delete_forever')}
          </Button>
        }
      />
    </div>
  );
};
