'use client';

import { useState } from 'react';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { Panel } from '@/app/shared/ui/Panel';
import { Button } from '@/app/shared/ui/Button';
import { BrainIcon, PlusIcon } from '@/app/shared/icons';
import { SurahSelector } from './SurahSelector';

interface CreateMemorizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateMemorizationModal = ({ isOpen, onClose }: CreateMemorizationModalProps) => {
  const [planName, setPlanName] = useState('');
  const [startSurah, setStartSurah] = useState<number | undefined>(undefined);
  const [endSurah, setEndSurah] = useState<number | undefined>(undefined);
  const [estimatedDays, setEstimatedDays] = useState<number>(5);
  const { chapters, createMemorizationPlan } = useBookmarks();

  // Calculate total verses for selected range
  const calculateTotalVerses = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (planName.trim() && startSurah && endSurah && totalVerses > 0) {
      // For now, create individual plans for each surah in the range
      for (let surahId = startSurah; surahId <= endSurah; surahId++) {
        const chapter = chapters.find((c) => c.id === surahId);
        if (chapter) {
          createMemorizationPlan(
            surahId,
            chapter.verses_count,
            startSurah === endSurah
              ? planName.trim()
              : `${planName.trim()} - ${chapter.name_simple}`
          );
        }
      }
      handleClose();
    }
  };

  const handleClose = () => {
    setPlanName('');
    setStartSurah(undefined);
    setEndSurah(undefined);
    setEstimatedDays(5);
    onClose();
  };

  const isValidRange = startSurah && endSurah && startSurah <= endSurah;
  const canSubmit = planName.trim() && isValidRange && totalVerses > 0;

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Name */}
          <div className="space-y-2">
            <label htmlFor="plan-name" className="block text-sm font-semibold text-foreground">
              Set Plan Name
            </label>
            <div className="relative">
              <input
                id="plan-name"
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="Enter Plan Name"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-foreground placeholder-muted focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
                maxLength={50}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted text-sm">
                {planName.length}/50
              </div>
            </div>
          </div>

          {/* Start Surah */}
          <div className="space-y-2">
            <label htmlFor="start-surah" className="block text-sm font-semibold text-foreground">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-accent/10 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                </div>
                Start Surah
              </div>
            </label>
            <SurahSelector
              id="start-surah"
              chapters={chapters}
              value={startSurah}
              onChange={setStartSurah}
              placeholder="Select Start Surah"
            />
          </div>

          {/* End Surah */}
          <div className="space-y-2">
            <label htmlFor="end-surah" className="block text-sm font-semibold text-foreground">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-accent/10 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                </div>
                End Surah
              </div>
            </label>
            <SurahSelector
              id="end-surah"
              chapters={chapters}
              value={endSurah}
              onChange={setEndSurah}
              placeholder="Select End Surah"
              disabled={!startSurah}
            />
          </div>

          {/* Estimated Days */}
          <div className="space-y-2">
            <label htmlFor="estimated-days" className="block text-sm font-semibold text-foreground">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-accent/10 rounded flex items-center justify-center">
                  <div className="w-1 h-3 bg-accent rounded-sm"></div>
                </div>
                Estimated days
              </div>
            </label>
            <div className="relative">
              <input
                id="estimated-days"
                type="number"
                min="1"
                max="365"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-foreground focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Progress Summary */}
          {isValidRange && totalVerses > 0 && (
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">Plan Summary</h3>
              <div className="space-y-2 text-sm text-muted">
                <div className="flex justify-between">
                  <span>Total verses:</span>
                  <span className="font-medium text-foreground">{totalVerses}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated duration:</span>
                  <span className="font-medium text-foreground">{estimatedDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Verses per day:</span>
                  <span className="font-medium text-foreground">~{versesPerDay}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={handleClose} className="px-6 py-2.5">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!canSubmit}
              className="px-6 py-2.5 flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <PlusIcon size={18} />
              <span>Create New</span>
            </Button>
          </div>
        </form>
      </div>
    </Panel>
  );
};
