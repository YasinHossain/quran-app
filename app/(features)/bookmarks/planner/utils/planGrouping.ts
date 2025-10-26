import type { Chapter, PlannerPlan } from '@/types';

export interface PlannerPlanGroup {
  key: string;
  planName: string;
  planIds: string[];
  plans: PlannerPlan[];
  surahIds: number[];
  lastUpdated: number;
}

export const buildChapterLookup = (chapters: Chapter[]): Map<number, Chapter> =>
  chapters.reduce<Map<number, Chapter>>((lookup, chapter) => {
    lookup.set(chapter.id, chapter);
    return lookup;
  }, new Map<number, Chapter>());

export const getChapterDisplayName = (
  plan: PlannerPlan,
  chapter: Chapter | undefined
): string => {
  if (chapter?.name_simple) return chapter.name_simple;
  if (chapter?.translated_name?.name) return chapter.translated_name.name;
  if (chapter?.name_arabic) return chapter.name_arabic;
  return `Surah ${plan.surahId}`;
};

// More robust suffix stripper: removes any trailing separator + chapter name
// Supported separators: hyphen variants, pipe, middle dot, bullet, colon, with flexible spacing
const stripChapterSuffixFlexible = (planName: string, chapterName: string): string => {
  const name = planName.trim();
  const chapter = chapterName.trim();
  const escape = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const sepClass = '[-\u2013\u2014\u2212|\u00B7:\u2022]';
  const pattern = new RegExp(`\\s*${sepClass}\\s*${escape(chapter)}\\s*$`, 'i');
  if (pattern.test(name)) return name.replace(pattern, '').trim();
  return name;
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

export const getDisplayPlanName = (
  plan: PlannerPlan,
  chapterLookup: Map<number, Chapter>
): string => {
  const chapter = chapterLookup.get(plan.surahId);
  const chapterName = getChapterDisplayName(plan, chapter);
  const baseName = stripChapterSuffixFlexible(
    plan.notes ?? `Surah ${plan.surahId} Plan`,
    chapterName
  ).trim();
  if (baseName.length > 0) {
    return baseName;
  }
  const fallback = plan.notes?.trim();
  if (fallback && fallback.length > 0) {
    return fallback;
  }
  return `Surah ${plan.surahId} Plan`;
};

const buildGroupKey = (planName: string, surahIds: number[]): string =>
  `${planName.toLowerCase()}::${surahIds.join('-')}`;

export const buildSurahRangeNumberLabel = (surahIds: number[]): string => {
  if (surahIds.length === 0) return '';
  const firstId = surahIds[0];
  if (typeof firstId !== 'number') return '';
  if (surahIds.length === 1) return `Surah ${firstId}`;
  const lastId = surahIds[surahIds.length - 1];
  const normalizedLast = typeof lastId === 'number' ? lastId : firstId;
  return `Surah ${firstId}-${normalizedLast}`;
};

export const buildSurahRangeNameLabel = (
  surahIds: number[],
  chapterLookup: Map<number, Chapter>
): string => {
  if (surahIds.length === 0) return '';
  if (surahIds.length === 1) {
    const onlyId = surahIds[0];
    if (typeof onlyId !== 'number') return '';
    const chapter = chapterLookup.get(onlyId);
    return chapter?.name_simple ?? `Surah ${onlyId}`;
  }
  const firstId = surahIds[0];
  const lastId = surahIds[surahIds.length - 1];
  const firstChapter = typeof firstId === 'number' ? chapterLookup.get(firstId) : undefined;
  const lastChapter = typeof lastId === 'number' ? chapterLookup.get(lastId) : undefined;
  const firstName = firstChapter?.name_simple ?? (typeof firstId === 'number' ? `Surah ${firstId}` : '');
  const lastName = lastChapter?.name_simple ?? (typeof lastId === 'number' ? `Surah ${lastId}` : '');
  if (firstName === lastName) return firstName;
  return `${firstName} - ${lastName}`;
};

export const buildGroupRangeLabel = (
  surahIds: number[],
  chapterLookup: Map<number, Chapter>
): string => {
  const nameLabel = buildSurahRangeNameLabel(surahIds, chapterLookup);
  const numberLabel = buildSurahRangeNumberLabel(surahIds);
  if (!nameLabel) return numberLabel;
  if (nameLabel === numberLabel) return nameLabel;
  return `${nameLabel} (${numberLabel})`;
};

export const groupPlannerPlans = (
  planner: Record<string, PlannerPlan>,
  chapterLookup: Map<number, Chapter>
): PlannerPlanGroup[] => {
  const plans = Object.values(planner);
  if (plans.length === 0) {
    return [];
  }

  const groupedByName = plans.reduce(
    (acc, plan) => {
      const displayName = getDisplayPlanName(plan, chapterLookup);
      const key = displayName.toLowerCase();
      if (!acc.has(key)) {
        acc.set(key, { displayName, plans: [] as PlannerPlan[] });
      }
      acc.get(key)?.plans.push(plan);
      return acc;
    },
    new Map<string, { displayName: string; plans: PlannerPlan[] }>()
  );

  const groups: PlannerPlanGroup[] = [];

  groupedByName.forEach(({ displayName, plans: groupedPlans }) => {
    const sortedPlans = groupedPlans.slice().sort((a, b) => a.surahId - b.surahId);
    let sequence: PlannerPlan[] = [];

    const flushSequence = () => {
      if (sequence.length === 0) return;
      const surahIds = sequence.map((plan) => plan.surahId);
      const planIds = sequence.map((plan) => plan.id);
      const lastUpdated = sequence.reduce(
        (latest, plan) => Math.max(latest, plan.lastUpdated),
        0
      );
      groups.push({
        key: buildGroupKey(displayName, surahIds),
        planName: displayName,
        planIds,
        plans: sequence.slice(),
        surahIds,
        lastUpdated,
      });
      sequence = [];
    };

    sortedPlans.forEach((plan) => {
      if (sequence.length === 0) {
        sequence = [plan];
        return;
      }
      const previous = sequence[sequence.length - 1]!;
      if (plan.surahId === previous.surahId + 1) {
        sequence = [...sequence, plan];
      } else {
        flushSequence();
        sequence = [plan];
      }
    });

    flushSequence();
  });

  return groups.sort((a, b) => b.lastUpdated - a.lastUpdated);
};
