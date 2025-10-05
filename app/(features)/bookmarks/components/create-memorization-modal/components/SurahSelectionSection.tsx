'use client';

import React from 'react';

import { SurahSelector } from '@/app/(features)/bookmarks/components/SurahSelector';

import type { PlanFormData } from '@/app/(features)/bookmarks/components/create-memorization-modal/types';
import type { Chapter } from '@/types';

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
        value={formData.startSurah}
        onChange={(id: number) => onFormDataChange({ startSurah: id })}
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
        value={formData.endSurah}
        onChange={(id: number) => onFormDataChange({ endSurah: id })}
        chapters={chapters}
      />
    </div>
  </div>
);
