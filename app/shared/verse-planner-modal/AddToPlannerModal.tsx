'use client';

import React, { useMemo } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { CloseIcon } from '@/app/shared/icons';
import { PanelModalCenter } from '@/app/shared/ui/PanelModalCenter';
import { Button } from '@/app/shared/ui/Button';

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
}

const extractSurahId = (surahId: number | undefined, verseKey: string): number | undefined => {
  if (typeof surahId === 'number') return surahId;
  const [surahPart] = verseKey.split(':');
  const parsed = Number(surahPart);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const buildChapterLookup = (chapters: Chapter[]): Map<number, Chapter> =>
  chapters.reduce<Map<number, Chapter>>((lookup, chapter) => {
    lookup.set(chapter.id, chapter);
    return lookup;
  }, new Map<number, Chapter>());

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

const getChapterDisplayName = (plan: PlannerPlan, chapter: Chapter | undefined): string => {
  if (chapter?.name_simple) return chapter.name_simple;
  if (chapter?.translated_name?.name) return chapter.translated_name.name;
  if (chapter?.name_arabic) return chapter.name_arabic;
  return `Surah ${plan.surahId}`;
};

const stripChapterSuffix = (planName: string, chapterName: string): string => {
  const normalizedName = planName.trim();
  const normalizedChapter = chapterName.trim();

  const suffixes = [
    ` - ${normalizedChapter}`,
    ` • ${normalizedChapter}`,
    ` · ${normalizedChapter}`,
  ];

  for (const suffix of suffixes) {
    if (normalizedName.toLowerCase().endsWith(suffix.toLowerCase())) {
      return normalizedName.slice(0, normalizedName.length - suffix.length).trim();
    }
  }

  return normalizedName;
};

const getVerseRangeLabel = (
  chapterName: string,
  chapter: Chapter | undefined,
  plan: PlannerPlan
): string => {
  const versesTotal = plan.targetVerses || chapter?.verses_count;
  if (!versesTotal) return chapterName;

  return `${chapterName} 1:1 to ${chapterName} 1:${versesTotal}`;
};

const buildPlannerCardViewModel = (
  plan: PlannerPlan,
  chapterLookup: Map<number, Chapter>
): PlannerCardViewModel => {
  const chapter = chapterLookup.get(plan.surahId);
  const chapterName = getChapterDisplayName(plan, chapter);
  const verseRangeLabel = getVerseRangeLabel(chapterName, chapter, plan);
  const displayPlanName = stripChapterSuffix(
    plan.notes ?? `Surah ${plan.surahId} Plan`,
    chapterName
  );

  return {
    id: plan.id,
    planName: displayPlanName,
    verseRangeLabel,
    estimatedDays: plan.estimatedDays,
  };
};

function usePlannerCards(
  planner: Record<string, PlannerPlan>,
  chapterLookup: Map<number, Chapter>
): PlannerCardViewModel[] {
  return useMemo(() => {
    const sortedPlans = [...Object.values(planner)].sort((a, b) => b.lastUpdated - a.lastUpdated);

    return sortedPlans.map((plan) => buildPlannerCardViewModel(plan, chapterLookup));
  }, [planner, chapterLookup]);
}

export function AddToPlannerModal({
  isOpen,
  onClose,
  verseSummary,
}: AddToPlannerModalProps): React.JSX.Element | null {
  const { planner, chapters } = useBookmarks();

  const chapterLookup = useMemo(() => buildChapterLookup(chapters), [chapters]);
  const { title, subtitle } = useVerseHeaderLabel(verseSummary, chapterLookup);
  const plannerCards = usePlannerCards(planner, chapterLookup);

  if (!isOpen) {
    return null;
  }

  return (
    <PanelModalCenter
      isOpen={isOpen}
      onClose={onClose}
      title={undefined}
      className="w-full max-w-xl rounded-xl border border-border/30 bg-background p-3 shadow-modal sm:rounded-2xl sm:p-5"
      showCloseButton={false}
    >
      <header className="mb-6">
        <div className="mx-auto flex w-full max-w-lg items-start justify-between gap-4">
          <div>
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
      <PlannerCardsSection plannerCards={plannerCards} verseSummary={verseSummary} />
    </PanelModalCenter>
  );
}
