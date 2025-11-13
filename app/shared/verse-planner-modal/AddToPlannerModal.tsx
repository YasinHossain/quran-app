'use client';

import React, { useMemo, useCallback, useState, useEffect } from 'react';

import {
  buildChapterLookup,
  buildGroupRangeLabel,
  getChapterDisplayName,
  groupPlannerPlans,
} from '@/app/(features)/bookmarks/planner/utils/planGrouping';
import {
  clampActualVerseToPlanRange,
  convertActualVerseToPlanProgress,
  getPlanEndVerse,
  getPlanStartVerse,
} from '@/app/(features)/bookmarks/planner/utils/planRange';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { CloseIcon } from '@/app/shared/icons';
import { Button } from '@/app/shared/ui/Button';
import { PanelModalCenter } from '@/app/shared/ui/PanelModalCenter';

import { PlannerCardsSection } from './components/PlannerCardsSection';

import type { Chapter, PlannerPlan } from '@/types';

export interface VerseSummaryDetails {
  verseKey: string;
  surahId?: number;
  arabicText?: string;
  translationHtml?: string;
}

interface AddToPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  verseSummary: VerseSummaryDetails;
}

export interface PlannerCardViewModel {
  id: string;
  planName: string;
  verseRangeLabel: string;
  estimatedDays?: number;
  planIds: string[];
  reactKey: string;
}

const extractSurahId = (surahId: number | undefined, verseKey: string): number | undefined => {
  if (typeof surahId === 'number') return surahId;
  const [surahPart] = verseKey.split(':');
  const parsed = Number(surahPart);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const extractVerseNumber = (verseKey: string): number | undefined => {
  const [, ayahPart] = verseKey.split(':');
  if (!ayahPart) return undefined;
  const parsed = Number(ayahPart);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const useVerseHeaderLabel = (
  verseSummary: VerseSummaryDetails,
  chapterLookup: Map<number, Chapter>
): { title: string; subtitle: string } => {
  const verseSurahId = useMemo(
    () => extractSurahId(verseSummary.surahId, verseSummary.verseKey),
    [verseSummary.surahId, verseSummary.verseKey]
  );

  const verseChapter = useMemo(
    () => (verseSurahId ? chapterLookup.get(verseSurahId) : undefined),
    [chapterLookup, verseSurahId]
  );

  const surahName = useMemo(() => {
    if (verseChapter?.name_simple) return verseChapter.name_simple;
    if (verseChapter?.translated_name?.name) return verseChapter.translated_name.name;
    if (verseChapter?.name_arabic) return verseChapter.name_arabic;
    return verseSummary.verseKey.split(':')[0] ?? 'Surah';
  }, [verseChapter, verseSummary.verseKey]);

  return {
    title: 'Add to Planner',
    subtitle: `${surahName} ${verseSummary.verseKey}`,
  };
};

function usePlannerCards(
  planner: Record<string, PlannerPlan>,
  chapterLookup: Map<number, Chapter>,
  currentSurahId: number | undefined
): PlannerCardViewModel[] {
  return useMemo(() => {
    const groups = groupPlannerPlans(planner, chapterLookup);
    return groups.map((group) => {
      const matchingPlan =
        typeof currentSurahId === 'number'
          ? group.plans.find((plan) => plan.surahId === currentSurahId)
          : undefined;
      const primaryPlan = matchingPlan ?? group.plans[0];
      const card: PlannerCardViewModel = {
        id: primaryPlan?.id ?? group.planIds[0] ?? group.key,
        planName: group.planName,
        verseRangeLabel: buildGroupRangeLabel(group.surahIds, chapterLookup),
        planIds: group.planIds,
        reactKey: group.key,
      };
      if (primaryPlan && typeof primaryPlan.estimatedDays === 'number') {
        card.estimatedDays = primaryPlan.estimatedDays;
      }
      return card;
    });
  }, [planner, chapterLookup, currentSurahId]);
}

export function AddToPlannerModal({
  isOpen,
  onClose,
  verseSummary,
}: AddToPlannerModalProps): React.JSX.Element | null {
  const { planner, chapters, updatePlannerProgress } = useBookmarks();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const chapterLookup = useMemo(() => buildChapterLookup(chapters), [chapters]);
  const verseSurahId = useMemo(
    () => extractSurahId(verseSummary.surahId, verseSummary.verseKey),
    [verseSummary.surahId, verseSummary.verseKey]
  );
  const { title, subtitle } = useVerseHeaderLabel(verseSummary, chapterLookup);
  const plannerCards = usePlannerCards(planner, chapterLookup, verseSurahId);
  const plansById = useMemo(() => {
    const map = new Map<string, PlannerPlan>();
    Object.values(planner).forEach((plan) => {
      map.set(plan.id, plan);
    });
    return map;
  }, [planner]);
  const verseNumber = useMemo(
    () => extractVerseNumber(verseSummary.verseKey),
    [verseSummary.verseKey]
  );
  const selectedPlan = useMemo(() => {
    return selectedPlanId ? plansById.get(selectedPlanId) : undefined;
  }, [plansById, selectedPlanId]);
  const hasValidReference =
    typeof verseSurahId === 'number' && typeof verseNumber === 'number' && verseNumber > 0;
  const canSave =
    Boolean(selectedPlan) &&
    hasValidReference &&
    typeof verseSurahId === 'number' &&
    selectedPlan?.surahId === verseSurahId;
  const mismatchSelection =
    selectedPlan && typeof verseSurahId === 'number'
      ? selectedPlan.surahId !== verseSurahId
      : false;
  const helperMessage = useMemo(() => {
    if (!selectedPlan) return null;
    if (!hasValidReference) {
      return 'Unable to determine the current verse reference for this planner.';
    }
    if (mismatchSelection) {
      const chapter = chapterLookup.get(selectedPlan.surahId);
      const plannerName = getChapterDisplayName(selectedPlan, chapter);
      return `This planner is for ${plannerName}. Choose a planner for this surah to continue.`;
    }
    if (typeof verseNumber === 'number') {
      const start = getPlanStartVerse(selectedPlan);
      const end = getPlanEndVerse(selectedPlan);
      if (verseNumber < start) {
        return `This planner starts at verse ${start}. Progress will begin from there.`;
      }
      if (verseNumber > end) {
        return `This planner ends at verse ${end}. Progress will be capped at the end of the plan.`;
      }
    }
    return null;
  }, [selectedPlan, hasValidReference, mismatchSelection, chapterLookup, verseNumber]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedPlanId(null);
    }
  }, [isOpen]);

  const handlePlanSelect = useCallback((planId: string) => {
    setSelectedPlanId(planId);
  }, []);

  const handleSave = useCallback(() => {
    if (!selectedPlanId) {
      return;
    }

    const plan = plansById.get(selectedPlanId);
    if (!plan) {
      return;
    }

    if (!hasValidReference || typeof verseSurahId !== 'number' || plan.surahId !== verseSurahId) {
      return;
    }

    if (typeof verseNumber !== 'number') {
      return;
    }

    // Determine the full group that contains this selected plan
    const groups = groupPlannerPlans(planner, chapterLookup);
    const group = groups.find((g) => g.planIds.includes(plan.id));

    // If we couldn't find the group, only update the selected plan.
    if (!group) {
      const normalizedVerse = clampActualVerseToPlanRange(plan, verseNumber);
      const planProgress = convertActualVerseToPlanProgress(plan, normalizedVerse);
      const nextCompleted = Math.max(plan.completedVerses, planProgress);
      if (nextCompleted !== plan.completedVerses) {
        updatePlannerProgress(plan.id, nextCompleted);
      }
    } else {
      // Cascade: mark all earlier surahs in the group as fully completed,
      // and set the selected surah to the chosen verse number.
      const selectedSurahId = verseSurahId;
      for (const p of group.plans) {
        if (p.surahId < selectedSurahId) {
          const newCompleted = Math.max(0, Math.min(p.targetVerses, p.targetVerses));
          if (newCompleted !== p.completedVerses) {
            updatePlannerProgress(p.id, newCompleted);
          }
        } else if (p.surahId === selectedSurahId) {
          const normalizedVerse = clampActualVerseToPlanRange(p, verseNumber);
          const planProgress = convertActualVerseToPlanProgress(p, normalizedVerse);
          const nextCompleted = Math.max(p.completedVerses, planProgress);
          if (nextCompleted !== p.completedVerses) {
            updatePlannerProgress(p.id, nextCompleted);
          }
        }
      }
    }

    setSelectedPlanId(null);
    onClose();
  }, [
    selectedPlanId,
    plansById,
    hasValidReference,
    verseSurahId,
    verseNumber,
    planner,
    chapterLookup,
    updatePlannerProgress,
    onClose,
  ]);

  if (!isOpen) {
    return null;
  }

  const contentContainerClass = 'mx-auto w-full max-w-lg';

  return (
    <PanelModalCenter
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-xl rounded-xl border border-border/30 bg-background p-3 shadow-modal sm:rounded-2xl sm:p-5"
      showCloseButton={false}
    >
      <div className="flex h-full min-h-0 flex-col">
        <header className="mb-4 shrink-0">
          <div className={`${contentContainerClass} flex items-start justify-between gap-4`}>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h2 className="text-xl font-semibold text-content-primary">{title}</h2>
              <p className="text-sm text-content-secondary">{subtitle}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close planner modal"
              className="shrink-0 text-content-secondary hover:text-content-primary"
            >
              <CloseIcon size={18} />
            </Button>
          </div>
        </header>

        <div className={`${contentContainerClass} flex-1 min-h-0 overflow-y-auto`}>
          <PlannerCardsSection
            plannerCards={plannerCards}
            verseSummary={verseSummary}
            selectedPlanId={selectedPlanId}
            onPlanSelect={handlePlanSelect}
          />
          {helperMessage ? (
            <p className="mt-3 text-sm text-content-secondary">{helperMessage}</p>
          ) : null}
        </div>

        <div className={`${contentContainerClass} mt-4 flex items-center justify-end shrink-0`}>
          <Button onClick={handleSave} disabled={!canSave}>
            Save
          </Button>
        </div>
      </div>
    </PanelModalCenter>
  );
}
