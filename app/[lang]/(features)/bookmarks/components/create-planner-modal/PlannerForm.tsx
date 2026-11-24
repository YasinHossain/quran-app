'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { CounterInput } from '@/app/shared/ui/inputs/CounterInput';

import { PlanNameInput, SurahSelectionSection, PlanStatistics, FormActions } from './components';

import type { PlanFormData } from './types';
import type { Chapter } from '@/types';

interface PlannerFormProps {
  formData: PlanFormData;
  onFormDataChange: (updates: Partial<PlanFormData>) => void;
  totalVerses: number;
  versesPerDay: number;
  isValidRange: boolean;
  canSubmit: boolean;
  duplicatePlanName?: string;
  onSubmit: (e: React.FormEvent) => void;
  chapters: Chapter[];
  formId?: string;
  showActions?: boolean;
}

export const PlannerForm = ({
  formData,
  onFormDataChange,
  totalVerses,
  versesPerDay,
  isValidRange,
  canSubmit,
  duplicatePlanName,
  onSubmit,
  chapters,
  formId,
  showActions = true,
}: PlannerFormProps): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-6">
      <PlanNameInput
        planName={formData.planName}
        onChange={(planName) => onFormDataChange({ planName })}
        {...(duplicatePlanName
          ? {
              errorMessage: t('planner_duplicate_name_error', { name: duplicatePlanName }),
            }
          : {})}
      />

      <SurahSelectionSection
        formData={formData}
        onFormDataChange={onFormDataChange}
        chapters={chapters}
      />

      <div className="space-y-2">
        <CounterInput
          label={t('planner_estimated_days')}
          value={formData.estimatedDays}
          onChange={(estimatedDays) => onFormDataChange({ estimatedDays })}
          min={1}
          max={365}
        />
      </div>

      <PlanStatistics
        isValidRange={isValidRange}
        totalVerses={totalVerses}
        versesPerDay={versesPerDay}
      />

      {showActions ? <FormActions canSubmit={canSubmit} {...(formId ? { formId } : {})} /> : null}
    </form>
  );
};
