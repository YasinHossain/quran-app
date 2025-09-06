'use client';

import React from 'react';

import {
  PlanNameInput,
  SurahSelectionSection,
  EstimatedDaysInput,
  PlanStatistics,
  FormActions,
} from './FormComponents';

import type { PlanFormData } from './types';
import type { Chapter } from '@/types';

interface MemorizationFormProps {
  formData: PlanFormData;
  onFormDataChange: (updates: Partial<PlanFormData>) => void;
  totalVerses: number;
  versesPerDay: number;
  isValidRange: boolean;
  canSubmit: boolean;
  onSubmit: (e: React.FormEvent) => void;
  chapters: Chapter[];
}

export const MemorizationForm = ({
  formData,
  onFormDataChange,
  totalVerses,
  versesPerDay,
  isValidRange,
  canSubmit,
  onSubmit,
  chapters,
}: MemorizationFormProps): React.JSX.Element => (
  <form onSubmit={onSubmit} className="space-y-6">
    <PlanNameInput
      planName={formData.planName}
      onChange={(planName) => onFormDataChange({ planName })}
    />

    <SurahSelectionSection
      formData={formData}
      onFormDataChange={onFormDataChange}
      chapters={chapters}
    />

    <EstimatedDaysInput
      estimatedDays={formData.estimatedDays}
      onChange={(estimatedDays) => onFormDataChange({ estimatedDays })}
    />

    <PlanStatistics
      isValidRange={isValidRange}
      totalVerses={totalVerses}
      versesPerDay={versesPerDay}
    />

    <FormActions canSubmit={canSubmit} />
  </form>
);
