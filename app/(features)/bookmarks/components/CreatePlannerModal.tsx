'use client';

import React from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { PanelModalCenter } from '@/app/shared/ui/PanelModalCenter';

import {
  ModalHeader,
  PlannerForm,
  usePlannerCalculations,
  useFormState,
  buildPlannerPlanDefinitions,
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
  const { chapters, planner, createPlannerPlan } = useBookmarks();

  const { totalVerses, versesPerDay, isValidRange } = usePlannerCalculations(
    chapters,
    formData.startSurah,
    formData.endSurah,
    formData.estimatedDays
  );

  const planDefinitions = React.useMemo(
    () => buildPlannerPlanDefinitions(formData, chapters),
    [formData, chapters]
  );

  const duplicatePlanName = React.useMemo(() => {
    if (planDefinitions.length === 0) return null;

    const trimmedInputName = formData.planName.trim();
    if (trimmedInputName.length === 0) return null;
    const normalizedInput = trimmedInputName.toLowerCase();

    const hasConflict = Object.values(planner).some((plan) => {
      const rawName = plan.notes?.trim();
      if (!rawName) return false;
      let normalizedExisting = rawName.toLowerCase();

      const chapter = chapters.find((c) => c.id === plan.surahId);
      const chapterName = chapter?.name_simple?.trim();
      if (chapterName) {
        const suffix = ` - ${chapterName}`.toLowerCase();
        if (normalizedExisting.endsWith(suffix)) {
          normalizedExisting = normalizedExisting
            .slice(0, normalizedExisting.length - suffix.length)
            .trim();
        }
      }

      return normalizedExisting === normalizedInput;
    });

    return hasConflict ? trimmedInputName : null;
  }, [planDefinitions, formData.planName, planner, chapters]);

  const hasPlanName = formData.planName.trim().length > 0;
  const canSubmit = hasPlanName && isValidRange && totalVerses > 0 && !duplicatePlanName;

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
          {...(duplicatePlanName ? { duplicatePlanName } : {})}
          onSubmit={handleSubmit}
          chapters={chapters}
        />
      </div>
    </PanelModalCenter>
  );
};
