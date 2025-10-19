'use client';

import React from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { PanelModalCenter } from '@/app/shared/ui/PanelModalCenter';

import {
  ModalHeader,
  PlannerForm,
  usePlannerCalculations,
  useFormState,
  createPlannerPlansForRange,
} from './create-planner-modal';

interface CreatePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePlannerModal = ({
  isOpen,
  onClose,
}: CreatePlannerModalProps): React.JSX.Element => {
  const { formData, handleFormDataChange, resetForm } = useFormState();
  const { chapters, createPlannerPlan } = useBookmarks();

  const { totalVerses, versesPerDay, isValidRange } = usePlannerCalculations(
    chapters,
    formData.startSurah,
    formData.endSurah,
    formData.estimatedDays
  );

  const hasPlanName = formData.planName.trim().length > 0;
  const canSubmit = hasPlanName && isValidRange && totalVerses > 0;

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (canSubmit) {
      createPlannerPlansForRange(formData, chapters, createPlannerPlan);
      handleClose();
    }
  };

  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  return (
    <PanelModalCenter
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={true}
      closeOnOverlayClick={true}
    >
      <div className="p-6">
        <ModalHeader />
        <PlannerForm
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
    </PanelModalCenter>
  );
};
