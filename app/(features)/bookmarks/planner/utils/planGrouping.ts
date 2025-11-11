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

export const getChapterDisplayName = (plan: PlannerPlan, chapter: Chapter | undefined): string => {
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

const resolveSurahName = (chapter: Chapter | undefined, surahId: number | undefined): string => {
  if (chapter?.name_simple) return chapter.name_simple;
  if (typeof surahId === 'number') return `Surah ${surahId}`;
  return '';
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
    return resolveSurahName(chapter, onlyId);
  }
  const firstId = surahIds[0];
  const lastId = surahIds[surahIds.length - 1];
  const firstChapter = typeof firstId === 'number' ? chapterLookup.get(firstId) : undefined;
  const lastChapter = typeof lastId === 'number' ? chapterLookup.get(lastId) : undefined;
  const firstName = resolveSurahName(
    firstChapter,
    typeof firstId === 'number' ? firstId : undefined
  );
  const lastName = resolveSurahName(lastChapter, typeof lastId === 'number' ? lastId : undefined);
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

type PlanBucket = { displayName: string; plans: PlannerPlan[] };

interface PlanKeyMetadata {
  canonicalKey: string;
  displayName: string;
}

const parsePlanKey = (plan: PlannerPlan, chapterLookup: Map<number, Chapter>): PlanKeyMetadata => {
  const displayName = getDisplayPlanName(plan, chapterLookup);
  return { canonicalKey: displayName.toLowerCase(), displayName };
};

const sortGroupsByChapter = (plans: PlannerPlan[]): PlannerPlan[] =>
  plans.slice().sort((a, b) => a.surahId - b.surahId);

const groupByChapterOrRange = (plans: PlannerPlan[]): PlannerPlan[][] => {
  if (plans.length === 0) return [];

  const sequences: PlannerPlan[][] = [];
  let currentSequence: PlannerPlan[] = [];

  const flush = (): void => {
    if (currentSequence.length === 0) return;
    sequences.push(currentSequence);
    currentSequence = [];
  };

  plans.forEach((plan) => {
    if (currentSequence.length === 0) {
      currentSequence = [plan];
      return;
    }

    const previous = currentSequence[currentSequence.length - 1]!;
    if (plan.surahId === previous.surahId + 1) {
      currentSequence.push(plan);
      return;
    }

    flush();
    currentSequence = [plan];
  });

  flush();
  return sequences;
};

const formatGroupLabel = (
  displayName: string,
  surahIds: number[],
  chapterLookup: Map<number, Chapter>
): string => {
  if (displayName.trim().length > 0) {
    return displayName;
  }
  return buildGroupRangeLabel(surahIds, chapterLookup);
};

const buildGroupsFromBucket = (
  bucket: PlanBucket,
  chapterLookup: Map<number, Chapter>
): PlannerPlanGroup[] => {
  const sortedPlans = sortGroupsByChapter(bucket.plans);
  const sequences = groupByChapterOrRange(sortedPlans);

  return sequences.map((sequence) => {
    const surahIds = sequence.map((plan) => plan.surahId);
    const planIds = sequence.map((plan) => plan.id);
    const lastUpdated = sequence.reduce((latest, plan) => Math.max(latest, plan.lastUpdated), 0);
    const planName = formatGroupLabel(bucket.displayName, surahIds, chapterLookup);

    return {
      key: buildGroupKey(planName, surahIds),
      planName,
      planIds,
      plans: sequence,
      surahIds,
      lastUpdated,
    };
  });
};

export const groupPlannerPlans = (
  planner: Record<string, PlannerPlan>,
  chapterLookup: Map<number, Chapter>
): PlannerPlanGroup[] => {
  const plans = Object.values(planner);
  if (plans.length === 0) {
    return [];
  }

  const groupedByName = plans.reduce<Map<string, PlanBucket>>((acc, plan) => {
    const { canonicalKey, displayName } = parsePlanKey(plan, chapterLookup);
    const bucket = acc.get(canonicalKey) ?? { displayName, plans: [] };
    bucket.plans.push(plan);
    acc.set(canonicalKey, bucket);
    return acc;
  }, new Map<string, PlanBucket>());

  const groups = Array.from(groupedByName.values()).flatMap((bucket) =>
    buildGroupsFromBucket(bucket, chapterLookup)
  );

  return groups.sort((a, b) => b.lastUpdated - a.lastUpdated);
};
