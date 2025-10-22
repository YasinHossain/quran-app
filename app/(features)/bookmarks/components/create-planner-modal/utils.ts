import type { PlanFormData } from './types';
import type { Chapter } from '@/types';

// Helper function to create planner plans for a range of surahs
export function createPlannerPlansForRange(
  formData: PlanFormData,
  chapters: Chapter[],
  createPlannerPlan: (
    surahId: number,
    versesCount: number,
    planName: string,
    estimatedDays?: number
  ) => void
): void {
  if (!formData.startSurah || !formData.endSurah) return;

  for (let surahId = formData.startSurah; surahId <= formData.endSurah; surahId++) {
    const chapter = chapters.find((c) => c.id === surahId);
    if (chapter) {
      const planName =
        formData.startSurah === formData.endSurah
          ? formData.planName.trim()
          : `${formData.planName.trim()} - ${chapter.name_simple}`;

      createPlannerPlan(surahId, chapter.verses_count, planName, formData.estimatedDays);
    }
  }
}
