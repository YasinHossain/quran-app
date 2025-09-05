'use client';

import { useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { BrainIcon, PlusIcon } from '@/app/shared/icons';
import { Button } from '@/app/shared/ui/Button';
import { Panel } from '@/app/shared/ui/Panel';

import { SurahSelector } from './SurahSelector';

interface CreateMemorizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PlanFormData {
  planName: string;
  startSurah: number | undefined;
  endSurah: number | undefined;
  estimatedDays: number;
}

// Custom hook for memorization calculations
function useMemorizationCalculations(
  chapters: any[],
  startSurah?: number,
  endSurah?: number,
  estimatedDays: number = 5
) {
  const calculateTotalVerses = (): number => {
    if (!startSurah || !endSurah || startSurah > endSurah) return 0;

    const start = chapters.find((c) => c.id === startSurah);
    const end = chapters.find((c) => c.id === endSurah);

    if (!start || !end) return 0;

    if (startSurah === endSurah) {
      return start.verses_count;
    }

    let total = 0;
    for (let i = startSurah; i <= endSurah; i++) {
      const chapter = chapters.find((c) => c.id === i);
      if (chapter) total += chapter.verses_count;
    }
    return total;
  };

  const totalVerses = calculateTotalVerses();
  const versesPerDay = estimatedDays > 0 ? Math.ceil(totalVerses / estimatedDays) : 0;
  const isValidRange = startSurah && endSurah && startSurah <= endSurah;

  return {
    totalVerses,
    versesPerDay,
    isValidRange,
  };
}

interface MemorizationFormProps {
  formData: PlanFormData;
  onFormDataChange: (updates: Partial<PlanFormData>) => void;
  totalVerses: number;
  versesPerDay: number;
  isValidRange: boolean;
  canSubmit: boolean;
  onSubmit: (e: React.FormEvent) => void;
  chapters: any[];
}

const MemorizationForm = ({
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
    <div className="space-y-2">
      <label htmlFor="plan-name" className="block text-sm font-semibold text-foreground">
        Set Plan Name
      </label>
      <div className="relative">
        <input
          id="plan-name"
          type="text"
          value={formData.planName}
          onChange={(e) => onFormDataChange({ planName: e.target.value })}
          placeholder="Enter Plan Name"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-foreground placeholder-muted focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
          maxLength={50}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted text-sm">
          {formData.planName.length}/50
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-accent/10 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
            </div>
            Start Surah
          </div>
        </label>
        <SurahSelector
          selectedSurahId={formData.startSurah}
          onSurahSelect={(id) => onFormDataChange({ startSurah: id })}
          chapters={chapters}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-accent/10 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
            </div>
            End Surah
          </div>
        </label>
        <SurahSelector
          selectedSurahId={formData.endSurah}
          onSurahSelect={(id) => onFormDataChange({ endSurah: id })}
          chapters={chapters}
        />
      </div>
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground">Estimated Days</label>
      <input
        type="number"
        min="1"
        max="365"
        value={formData.estimatedDays}
        onChange={(e) => onFormDataChange({ estimatedDays: parseInt(e.target.value) || 1 })}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-foreground focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
      />
    </div>

    {isValidRange && totalVerses > 0 && (
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
    )}

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
  </form>
);

export const CreateMemorizationModal = ({
  isOpen,
  onClose,
}: CreateMemorizationModalProps): React.JSX.Element => {
  const [formData, setFormData] = useState<PlanFormData>({
    planName: '',
    startSurah: undefined,
    endSurah: undefined,
    estimatedDays: 5,
  });
  const { chapters, createMemorizationPlan } = useBookmarks();

  const { totalVerses, versesPerDay, isValidRange } = useMemorizationCalculations(
    chapters,
    formData.startSurah,
    formData.endSurah,
    formData.estimatedDays
  );

  const canSubmit = formData.planName.trim() && isValidRange && totalVerses > 0;

  const handleFormDataChange = (updates: Partial<PlanFormData>): void => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (formData.planName.trim() && formData.startSurah && formData.endSurah && totalVerses > 0) {
      for (let surahId = formData.startSurah; surahId <= formData.endSurah; surahId++) {
        const chapter = chapters.find((c) => c.id === surahId);
        if (chapter) {
          createMemorizationPlan(
            surahId,
            chapter.verses_count,
            formData.startSurah === formData.endSurah
              ? formData.planName.trim()
              : `${formData.planName.trim()} - ${chapter.name_simple}`
          );
        }
      }
      handleClose();
    }
  };

  const handleClose = (): void => {
    setFormData({
      planName: '',
      startSurah: undefined,
      endSurah: undefined,
      estimatedDays: 5,
    });
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
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center">
            <BrainIcon size={24} className="text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Memorization Planner</h2>
            <p className="text-sm text-muted mt-1">Create a new memorization plan</p>
          </div>
        </div>

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
