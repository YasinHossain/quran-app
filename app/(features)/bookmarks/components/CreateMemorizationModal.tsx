'use client';

import React from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { Panel } from '@/app/shared/ui/Panel';

import {
  ModalHeader,
  MemorizationForm,
  useMemorizationCalculations,
  useFormState,
  createMemorizationPlansForRange,
} from './create-memorization-modal';

interface CreateMemorizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateMemorizationModal = ({
  isOpen,
  onClose,
}: CreateMemorizationModalProps): React.JSX.Element => {
  const { formData, handleFormDataChange, resetForm } = useFormState();
  const { chapters, createMemorizationPlan } = useBookmarks();

  const { totalVerses, versesPerDay, isValidRange } = useMemorizationCalculations(
    chapters,
    formData.startSurah,
    formData.endSurah,
    formData.estimatedDays
  );

  const canSubmit = formData.planName.trim() && isValidRange && totalVerses > 0;

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (canSubmit) {
      createMemorizationPlansForRange(formData, chapters, createMemorizationPlan);
      handleClose();
    }
  };

  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  return (
    <Panel
      isOpen={isOpen}
      onClose={handleClose}
      variant="modal-center"
      title=""
      showCloseButton={true}
      closeOnOverlayClick={true}
    >
      <div className="p-6">
        <ModalHeader />
        <MemorizationForm
          formData={formData}
          onFormDataChange={handleFormDataChange}
          totalVerses={totalVerses}
          versesPerDay={versesPerDay}
          isValidRange={isValidRange}
          canSubmit={canSubmit}
          onSubmit={handleSubmit}
          chapters={chapters}
        />
      </div>
    </Panel>
  );
};
