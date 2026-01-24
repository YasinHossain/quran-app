'use client';

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
import { ModalFooter } from '@/app/shared/components/modal/ModalFooter';
import { UnifiedModal } from '@/app/shared/components/modal/UnifiedModal';
import { CloseIcon } from '@/app/shared/icons';
import { Button } from '@/app/shared/ui/Button';
import { localizeDigits } from '@/lib/text/localizeNumbers';

import { PlannerCardsSection } from './components/PlannerCardsSection';

import type { Chapter, PlannerPlan } from '@/types';
import type { TFunction } from 'i18next';

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
  const { t, i18n } = useTranslation();
  const verseSurahId = useMemo(
    () => extractSurahId(verseSummary.surahId, verseSummary.verseKey),
    [verseSummary.surahId, verseSummary.verseKey]
  );

  const verseChapter = useMemo(
    () => (verseSurahId ? chapterLookup.get(verseSurahId) : undefined),
    [chapterLookup, verseSurahId]
  );

  const fallbackSurahName = useMemo(() => {
    if (verseChapter?.name_simple) return verseChapter.name_simple;
    if (verseChapter?.translated_name?.name) return verseChapter.translated_name.name;
    if (verseChapter?.name_arabic) return verseChapter.name_arabic;
    return typeof verseSurahId === 'number' ? `Surah ${verseSurahId}` : t('surah_tab');
  }, [t, verseChapter, verseSurahId]);

  const surahName = useMemo(() => {
    if (typeof verseSurahId !== 'number') return fallbackSurahName;
    return t(`surah_names.${verseSurahId}`, fallbackSurahName);
  }, [fallbackSurahName, t, verseSurahId]);

  const localizedVerseKey = useMemo(
    () => localizeDigits(verseSummary.verseKey, i18n.language),
    [verseSummary.verseKey, i18n.language]
  );

  return {
    title: t('add_to_plan'),
    subtitle: `${surahName} ${localizedVerseKey}`,
  };
};

function usePlannerCards(
  planner: Record<string, PlannerPlan>,
  chapterLookup: Map<number, Chapter>,
  currentSurahId: number | undefined,
  i18n?: { t: TFunction; language: string }
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
        verseRangeLabel: buildGroupRangeLabel(group.surahIds, chapterLookup, i18n),
        planIds: group.planIds,
        reactKey: group.key,
      };
      if (primaryPlan && typeof primaryPlan.estimatedDays === 'number') {
        card.estimatedDays = primaryPlan.estimatedDays;
      }
      return card;
    });
  }, [planner, chapterLookup, currentSurahId, i18n]);
}

export function AddToPlannerModal({
  isOpen,
  onClose,
  verseSummary,
}: AddToPlannerModalProps): React.JSX.Element | null {
  const { t, i18n } = useTranslation();
  const plannerI18n = useMemo(() => ({ t, language: i18n.language }), [t, i18n.language]);
  const { planner, chapters, updatePlannerProgress } = useBookmarks();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const chapterLookup = useMemo(() => buildChapterLookup(chapters), [chapters]);
  const verseSurahId = useMemo(
    () => extractSurahId(verseSummary.surahId, verseSummary.verseKey),
    [verseSummary.surahId, verseSummary.verseKey]
  );
  const { title, subtitle } = useVerseHeaderLabel(verseSummary, chapterLookup);
  const plannerCards = usePlannerCards(planner, chapterLookup, verseSurahId, plannerI18n);
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
      return t('add_to_plan_invalid_reference');
    }
    if (mismatchSelection) {
      const chapter = chapterLookup.get(selectedPlan.surahId);
      const fallbackName = getChapterDisplayName(selectedPlan, chapter);
      const plannerName = t(`surah_names.${selectedPlan.surahId}`, fallbackName);
      return t('add_to_plan_mismatch_helper', { surah: plannerName });
    }
    if (typeof verseNumber === 'number') {
      const start = getPlanStartVerse(selectedPlan);
      const end = getPlanEndVerse(selectedPlan);
      if (verseNumber < start) {
        return t('add_to_plan_starts_at_helper', { verse: start });
      }
      if (verseNumber > end) {
        return t('add_to_plan_ends_at_helper', { verse: end });
      }
    }
    return null;
  }, [selectedPlan, hasValidReference, mismatchSelection, chapterLookup, verseNumber, t]);

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

  const contentContainerClass = 'mx-auto w-full max-w-lg';

  return (
    <UnifiedModal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={t('add_to_plan')}
      contentClassName="w-full max-w-xl mx-auto max-h-[calc(100dvh-2rem)] min-h-0 overflow-hidden flex flex-col px-4 pb-4 pt-8 sm:px-6 sm:pb-6 sm:pt-8"
    >
      <header className="mb-6 shrink-0">
        <div className={`${contentContainerClass} flex items-start justify-between gap-4`}>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 className="text-xl font-semibold text-content-primary">{title}</h2>
            <p className="text-sm text-content-secondary">{subtitle}</p>
          </div>
          <button
            className="p-1.5 rounded-full hover:bg-interactive-hover transition-colors text-content-secondary hover:text-content-primary shrink-0 flex items-center justify-center"
            onClick={onClose}
            aria-label={t('close')}
          >
            <CloseIcon size={18} />
          </button>
        </div>
      </header>

      <div
        className={`${contentContainerClass} flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y scrollbar-hide py-4`}
      >
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

      <div className={`${contentContainerClass} mt-6 shrink-0`}>
        <ModalFooter
          right={
            <Button onClick={handleSave} disabled={!canSave} className="rounded-lg px-5">
              {t('save')}
            </Button>
          }
        />
      </div>
    </UnifiedModal>
  );
}
