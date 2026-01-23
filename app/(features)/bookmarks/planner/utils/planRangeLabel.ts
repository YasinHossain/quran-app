import { localizeDigits } from '@/lib/text/localizeNumbers';

import type { PlannerI18nContext } from '@/app/(features)/bookmarks/planner/utils/plannerI18n';

interface PlannerRangePoint {
  chapterName: string;
  surahId: number | string;
  verse: number;
}

const formatChapterLabel = (
  { chapterName, surahId }: PlannerRangePoint,
  i18n?: PlannerI18nContext
): string => {
  const defaultName = chapterName?.trim().length
    ? chapterName.trim()
    : i18n
      ? i18n.t('surah_tab')
      : 'Surah';

  const numericSurahId =
    typeof surahId === 'number' ? surahId : Number.isFinite(Number(surahId)) ? Number(surahId) : null;

  const safeName =
    i18n && typeof numericSurahId === 'number'
      ? i18n.t(`surah_names.${numericSurahId}`, defaultName)
      : defaultName;
  const label = `${safeName} ${surahId}`;
  return i18n ? localizeDigits(label, i18n.language) : label;
};

const formatRangePoint = (point: PlannerRangePoint, i18n?: PlannerI18nContext): string => {
  const verse = Number.isFinite(point.verse) ? Math.max(1, Math.floor(point.verse)) : 1;
  const label = `${formatChapterLabel(point, i18n)}:${verse}`;
  return i18n ? localizeDigits(label, i18n.language) : label;
};

const isSamePoint = (
  start: PlannerRangePoint,
  end: PlannerRangePoint,
  i18n?: PlannerI18nContext
): boolean =>
  String(start.surahId) === String(end.surahId) &&
  Math.floor(start.verse) === Math.floor(end.verse) &&
  formatChapterLabel(start, i18n) === formatChapterLabel(end, i18n);

const formatDaysText = (estimatedDays?: number, i18n?: PlannerI18nContext): string | null => {
  if (typeof estimatedDays !== 'number' || estimatedDays <= 0) return null;
  const rounded = Math.round(estimatedDays);
  if (i18n) {
    return rounded === 1
      ? i18n.t('planner_one_day', { count: rounded })
      : i18n.t('planner_n_days', { count: rounded });
  }
  return `${rounded} day${rounded === 1 ? '' : 's'}`;
};

export const formatPlannerRangeLabel = (
  start: PlannerRangePoint,
  end: PlannerRangePoint,
  i18n?: PlannerI18nContext
): string => {
  const startLabel = formatRangePoint(start, i18n);
  if (isSamePoint(start, end, i18n)) {
    return startLabel;
  }
  const endLabel = formatRangePoint(end, i18n);
  if (i18n) {
    return `${startLabel} ${i18n.t('planner_range_to')} ${endLabel}`;
  }
  return `${startLabel} to ${endLabel}`;
};

export const formatPlannerRangeDetails = ({
  start,
  end,
  estimatedDays,
  i18n,
}: {
  start: PlannerRangePoint;
  end: PlannerRangePoint;
  estimatedDays?: number;
  i18n?: PlannerI18nContext;
}): string => {
  const rangeLabel = formatPlannerRangeLabel(start, end, i18n);
  const daysText = formatDaysText(estimatedDays, i18n);
  return daysText ? `${rangeLabel} • ${daysText}` : rangeLabel;
};

export type { PlannerRangePoint };
