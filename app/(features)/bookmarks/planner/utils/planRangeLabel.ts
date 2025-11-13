interface PlannerRangePoint {
  chapterName: string;
  surahId: number | string;
  verse: number;
}

const formatChapterLabel = ({ chapterName, surahId }: PlannerRangePoint): string => {
  const safeName = chapterName?.trim().length ? chapterName.trim() : `Surah ${surahId}`;
  return `${safeName} ${surahId}`;
};

const formatRangePoint = (point: PlannerRangePoint): string => {
  const verse = Number.isFinite(point.verse) ? Math.max(1, Math.floor(point.verse)) : 1;
  return `${formatChapterLabel(point)}:${verse}`;
};

const isSamePoint = (start: PlannerRangePoint, end: PlannerRangePoint): boolean =>
  String(start.surahId) === String(end.surahId) &&
  Math.floor(start.verse) === Math.floor(end.verse) &&
  formatChapterLabel(start) === formatChapterLabel(end);

const formatDaysText = (estimatedDays?: number): string | null => {
  if (typeof estimatedDays !== 'number' || estimatedDays <= 0) return null;
  const rounded = Math.round(estimatedDays);
  return `${rounded} day${rounded === 1 ? '' : 's'}`;
};

export const formatPlannerRangeLabel = (
  start: PlannerRangePoint,
  end: PlannerRangePoint
): string => {
  const startLabel = formatRangePoint(start);
  if (isSamePoint(start, end)) {
    return startLabel;
  }
  const endLabel = formatRangePoint(end);
  return `${startLabel} to ${endLabel}`;
};

export const formatPlannerRangeDetails = ({
  start,
  end,
  estimatedDays,
}: {
  start: PlannerRangePoint;
  end: PlannerRangePoint;
  estimatedDays?: number;
}): string => {
  const rangeLabel = formatPlannerRangeLabel(start, end);
  const daysText = formatDaysText(estimatedDays);
  return daysText ? `${rangeLabel} • ${daysText}` : rangeLabel;
};

export type { PlannerRangePoint };
