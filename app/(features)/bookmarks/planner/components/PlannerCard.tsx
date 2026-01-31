'use client';

import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { DailyFocusSection } from '@/app/(features)/bookmarks/planner/components/DailyFocusSection';
import { PlannerCardHeader } from '@/app/(features)/bookmarks/planner/components/PlannerCardHeader';
import { PlannerProgressSection } from '@/app/(features)/bookmarks/planner/components/PlannerProgressSection';
import { PlannerStatsSection } from '@/app/(features)/bookmarks/planner/components/PlannerStatsSection';
import { createPlannerCardViewModel } from '@/app/(features)/bookmarks/planner/utils/plannerCard';
import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';
import { CloseIcon } from '@/app/shared/icons';
import { buildSurahRoute } from '@/app/shared/navigation/routes';

import type { PlannerCardProps } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import type { PlannerCardViewModel } from '@/app/(features)/bookmarks/planner/utils/plannerCard';

export const PlannerCard = ({
  surahId,
  plan,
  chapter,
  precomputedViewModel,
  progressLabel,
  continueVerse,
  onDelete,
}: PlannerCardProps & { onDelete?: () => void }): React.JSX.Element => {
  const { t, i18n } = useTranslation();
  const i18nContext = React.useMemo(() => ({ t, language: i18n.language }), [t, i18n.language]);
  const viewModel = usePlannerViewModel({
    surahId,
    plan,
    ...(chapter ? { chapter } : {}),
    ...(precomputedViewModel ? { precomputedViewModel } : {}),
    i18nContext,
  });
  const handleNavigate = usePlannerNavigation(surahId, continueVerse);

  const handleContinueClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>): void => {
      event.stopPropagation();
      handleNavigate();
    },
    [handleNavigate]
  );

  return (
    <div className="cq relative flex min-w-0 h-full flex-col rounded-lg border border-border/50 bg-surface p-6 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 sm:p-7 lg:min-w-[20rem] xl:min-w-[24rem] 2xl:min-w-[28rem]">
      <div className="relative z-10 flex h-full flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <PlannerCardHeader
              displayPlanName={viewModel.planInfo.displayPlanName}
              planDetailsText={viewModel.planInfo.planDetailsText}
            />
          </div>
          <PlannerCardDeleteButton {...(onDelete ? { onDelete } : {})} />
        </div>

        <DailyFocusSection focus={viewModel.focus} />

        <PlannerStatsSection stats={viewModel.stats} />

        <div className="mt-auto">
          <PlannerProgressSection
            progress={viewModel.progress}
            surahLabel={viewModel.planInfo.surahLabel}
            surahId={surahId}
            {...(typeof progressLabel === 'string' ? { currentVerseLabel: progressLabel } : {})}
            onContinue={handleContinueClick}
          />
        </div>
      </div>
    </div>
  );
};

const usePlannerViewModel = ({
  surahId,
  plan,
  chapter,
  precomputedViewModel,
  i18nContext,
}: Pick<PlannerCardProps, 'surahId' | 'plan' | 'chapter' | 'precomputedViewModel'> & {
  i18nContext: { t: ReturnType<typeof useTranslation>['t']; language: string };
}): PlannerCardViewModel => {
  return React.useMemo<PlannerCardViewModel>(() => {
    if (precomputedViewModel) {
      return precomputedViewModel;
    }
    const params: PlannerCardProps = chapter ? { surahId, plan, chapter } : { surahId, plan };
    return createPlannerCardViewModel(params, i18nContext);
  }, [chapter, plan, precomputedViewModel, surahId, i18nContext]);
};

const usePlannerNavigation = (
  surahId: string,
  continueVerse: PlannerCardProps['continueVerse']
): (() => void) => {
  const router = useRouter();
  const pathname = usePathname();

  return React.useCallback(() => {
    const parsedSurahId = Number.parseInt(surahId, 10);
    const fallbackSurahId = Number.isFinite(parsedSurahId) ? parsedSurahId : surahId;
    const resolvedSurahId = continueVerse?.surahId ?? fallbackSurahId;
    const targetPath = buildSurahRoute(
      resolvedSurahId,
      continueVerse?.verse && continueVerse.verse > 0
        ? { startVerse: continueVerse.verse, forceSeq: true }
        : undefined
    );
    const locale = getLocaleFromPathname(pathname) ?? 'en';
    router.push(localizeHref(targetPath, locale), { scroll: false });
  }, [continueVerse, pathname, router, surahId]);
};

const PlannerCardDeleteButton = ({
  onDelete,
}: {
  onDelete?: () => void;
}): React.JSX.Element | null => {
  const { t } = useTranslation();
  if (!onDelete) return null;
  return (
    <button
      type="button"
      aria-label={t('planner_delete_plan')}
      className="shrink-0 p-1.5 rounded-full text-muted hover:bg-interactive-hover hover:text-error transition-colors duration-200 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent/40 focus:outline-none"
      onClick={(event) => {
        event.stopPropagation();
        onDelete();
      }}
    >
      <CloseIcon size={18} />
    </button>
  );
};
