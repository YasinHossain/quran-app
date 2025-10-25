'use client';

import React from 'react';

import { EmptyPlannerState } from '@/app/shared/verse-planner-modal/EmptyPlannerState';
import { PlannerSelectionCard } from '@/app/shared/verse-planner-modal/PlannerSelectionCard';

import type {
  PlannerCardViewModel,
  VerseSummaryDetails,
} from '@/app/shared/verse-planner-modal/AddToPlannerModal';

interface PlannerCardsSectionProps {
  plannerCards: PlannerCardViewModel[];
  verseSummary: VerseSummaryDetails;
  selectedPlanId: string | null;
  onPlanSelect: (planId: string) => void;
}

export function PlannerCardsSection({
  plannerCards,
  verseSummary,
  selectedPlanId,
  onPlanSelect,
}: PlannerCardsSectionProps): React.JSX.Element {
  if (plannerCards.length === 0) {
    return (
      <div className="flex w-full flex-col gap-3 md:gap-4">
        <EmptyPlannerState verseLabel={verseSummary.verseKey} />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 md:gap-4">
      {plannerCards.map((plan) => (
        <PlannerSelectionCard
          key={plan.reactKey}
          id={plan.id}
          planName={plan.planName}
          verseRangeLabel={plan.verseRangeLabel}
          {...(typeof plan.estimatedDays === 'number' ? { estimatedDays: plan.estimatedDays } : {})}
          isSelected={
            typeof selectedPlanId === 'string' ? plan.planIds.includes(selectedPlanId) : false
          }
          onSelect={() => onPlanSelect(plan.id)}
        />
      ))}
    </div>
  );
}
