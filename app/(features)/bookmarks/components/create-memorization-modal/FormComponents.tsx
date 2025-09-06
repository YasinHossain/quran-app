'use client';

import React from 'react';

import { PlusIcon } from '@/app/shared/icons';
import { Button } from '@/app/shared/ui/Button';

import { SurahSelector } from '../SurahSelector';

import type { PlanFormData } from './types';
import type { Chapter } from '@/types';

// Plan name input component
interface PlanNameInputProps {
  planName: string;
  onChange: (planName: string) => void;
}

export const PlanNameInput = ({ planName, onChange }: PlanNameInputProps): React.JSX.Element => (
  <div className="space-y-2">
    <label htmlFor="plan-name" className="block text-sm font-semibold text-foreground">
      Set Plan Name
    </label>
    <div className="relative">
      <input
        id="plan-name"
        type="text"
        value={planName}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter Plan Name"
        className="w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-foreground placeholder-muted focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
        maxLength={50}
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted text-sm">
        {planName.length}/50
      </div>
    </div>
  </div>
);

// Surah selection component
interface SurahSelectionSectionProps {
  formData: PlanFormData;
  onFormDataChange: (updates: Partial<PlanFormData>) => void;
  chapters: Chapter[];
}

export const SurahSelectionSection = ({
  formData,
  onFormDataChange,
  chapters,
}: SurahSelectionSectionProps): React.JSX.Element => (
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <div className="block text-sm font-semibold text-foreground">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-accent/10 rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
          </div>
          Start Surah
        </div>
      </div>
      <SurahSelector
        selectedSurahId={formData.startSurah}
        onSurahSelect={(id) => onFormDataChange({ startSurah: id })}
        chapters={chapters}
      />
    </div>

    <div className="space-y-2">
      <div className="block text-sm font-semibold text-foreground">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-accent/10 rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
          </div>
          End Surah
        </div>
      </div>
      <SurahSelector
        selectedSurahId={formData.endSurah}
        onSurahSelect={(id) => onFormDataChange({ endSurah: id })}
        chapters={chapters}
      />
    </div>
  </div>
);

// Estimated days input component
interface EstimatedDaysInputProps {
  estimatedDays: number;
  onChange: (days: number) => void;
}

export const EstimatedDaysInput = ({
  estimatedDays,
  onChange,
}: EstimatedDaysInputProps): React.JSX.Element => (
  <div className="space-y-2">
    <label htmlFor="estimated-days" className="block text-sm font-semibold text-foreground">
      Estimated Days
    </label>
    <input
      id="estimated-days"
      type="number"
      min="1"
      max="365"
      value={estimatedDays}
      onChange={(e) => onChange(parseInt(e.target.value) || 1)}
      className="w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-foreground focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
    />
  </div>
);

// Statistics display component
interface PlanStatisticsProps {
  isValidRange: boolean;
  totalVerses: number;
  versesPerDay: number;
}

export const PlanStatistics = ({
  isValidRange,
  totalVerses,
  versesPerDay,
}: PlanStatisticsProps): React.JSX.Element | null => {
  if (!isValidRange || totalVerses === 0) return null;

  return (
    <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">Total Verses:</span>
        <span className="font-semibold text-foreground">{totalVerses.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">Verses per Day:</span>
        <span className="font-semibold text-accent">{versesPerDay}</span>
      </div>
    </div>
  );
};

// Form actions component
interface FormActionsProps {
  canSubmit: boolean;
}

export const FormActions = ({ canSubmit }: FormActionsProps): React.JSX.Element => (
  <div className="flex justify-end gap-3 pt-4">
    <Button type="button" variant="ghost" size="md" onClick={() => {}}>
      Cancel
    </Button>
    <Button
      type="submit"
      variant="primary"
      size="md"
      disabled={!canSubmit}
      className="min-w-[120px]"
    >
      <PlusIcon size={16} className="mr-2" />
      Create Plan
    </Button>
  </div>
);
