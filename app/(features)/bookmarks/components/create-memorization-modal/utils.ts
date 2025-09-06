import type { PlanFormData } from './types';
import type { Chapter } from '@/types';

// Helper function to create memorization plans for a range of surahs
export function createMemorizationPlansForRange(
  formData: PlanFormData,
  chapters: Chapter[],
  createMemorizationPlan: (surahId: number, versesCount: number, planName: string) => void
): void {
  if (!formData.startSurah || !formData.endSurah) return;

  for (let surahId = formData.startSurah; surahId <= formData.endSurah; surahId++) {
    const chapter = chapters.find((c) => c.id === surahId);
    if (chapter) {
      const planName =
        formData.startSurah === formData.endSurah
          ? formData.planName.trim()
          : `${formData.planName.trim()} - ${chapter.name_simple}`;

      createMemorizationPlan(surahId, chapter.verses_count, planName);
    }
  }
}
