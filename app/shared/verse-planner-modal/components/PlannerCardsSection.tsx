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
}

export function PlannerCardsSection({
  plannerCards,
  verseSummary,
}: PlannerCardsSectionProps): React.JSX.Element {
  if (plannerCards.length === 0) {
    return <EmptyPlannerState verseLabel={verseSummary.verseKey} />;
  }

  return (
    <div className="space-y-3 max-w-xl">
      {plannerCards.map((plan) => (
        <PlannerSelectionCard
          key={plan.id}
          id={plan.id}
          planName={plan.planName}
          verseRangeLabel={plan.verseRangeLabel}
          estimatedDays={plan.estimatedDays}
          onSelect={() => undefined}
        />
      ))}
    </div>
  );
}
