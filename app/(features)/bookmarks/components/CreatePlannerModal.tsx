'use client';

import React from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { CloseIcon } from '@/app/shared/icons';
import { PanelModalCenter } from '@/app/shared/ui/PanelModalCenter';

import {
  ModalHeader,
  PlannerForm,
  usePlannerCalculations,
  useFormState,
  buildPlannerPlanDefinitions,
  createPlannerPlansForRange,
} from './create-planner-modal';

import type { PlanFormData } from './create-planner-modal';
import type { Chapter, PlannerPlan } from '@/types';

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
    formData.startVerse,
    formData.endSurah,
    formData.endVerse,
    formData.estimatedDays
  );

  const planDefinitions = React.useMemo(
    () => buildPlannerPlanDefinitions(formData, chapters),
    [formData, chapters]
  );
  const duplicatePlanName = useDuplicatePlanName(formData, chapters, planner, planDefinitions);

  const canSubmit =
    formData.planName.trim().length > 0 && isValidRange && totalVerses > 0 && !duplicatePlanName;

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!canSubmit) return;
    createPlannerPlansForRange(formData, chapters, createPlannerPlan);
    handleClose();
  };

  const handleClose = useCloseHandler(resetForm, onClose);

  return (
    <PanelModalCenter
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      closeOnOverlayClick={true}
      className="max-w-lg px-3 sm:px-4 pt-4 pb-4"
    >
      <CreatePlannerForm
        formData={formData}
        onFormDataChange={handleFormDataChange}
        totalVerses={totalVerses}
        versesPerDay={versesPerDay}
        isValidRange={isValidRange}
        canSubmit={canSubmit}
        duplicatePlanName={duplicatePlanName}
        onSubmit={handleSubmit}
        chapters={chapters}
        onClose={handleClose}
      />
    </PanelModalCenter>
  );
};

function useDuplicatePlanName(
  formData: PlanFormData,
  chapters: Chapter[],
  planner: Record<string, PlannerPlan>,
  planDefinitions: ReturnType<typeof buildPlannerPlanDefinitions>
): string | null {
  return React.useMemo(() => {
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
}

function useCloseHandler(resetForm: () => void, onClose: () => void): () => void {
  return React.useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);
}

function CreatePlannerForm({
  formData,
  onFormDataChange,
  totalVerses,
  versesPerDay,
  isValidRange,
  canSubmit,
  duplicatePlanName,
  onSubmit,
  chapters,
  onClose,
}: {
  formData: PlanFormData;
  onFormDataChange: (updates: Partial<PlanFormData>) => void;
  totalVerses: number;
  versesPerDay: number;
  isValidRange: boolean;
  canSubmit: boolean;
  duplicatePlanName: string | null;
  onSubmit: (e: React.FormEvent) => void;
  chapters: Chapter[];
  onClose: () => void;
}): React.JSX.Element {
  return (
    <div className="px-3 sm:px-4 pt-4 pb-4">
      <div className="flex items-start justify-between gap-4">
        <ModalHeader />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close planner modal"
          className="text-muted hover:text-foreground transition-colors p-1"
        >
          <CloseIcon size={18} />
        </button>
      </div>
      <PlannerForm
        formData={formData}
        onFormDataChange={onFormDataChange}
        totalVerses={totalVerses}
        versesPerDay={versesPerDay}
        isValidRange={isValidRange}
        canSubmit={canSubmit}
        {...(duplicatePlanName ? { duplicatePlanName } : {})}
        onSubmit={onSubmit}
        chapters={chapters}
      />
    </div>
  );
}
