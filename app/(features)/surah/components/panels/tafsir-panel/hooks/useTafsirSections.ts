import { TafsirResource } from '@/types';

export const useTafsirSections = (
  activeFilter: string,
  tafsirs: TafsirResource[],
  groupedTafsirs: Record<string, TafsirResource[]>,
  languages: string[]
): {
  resourcesToRender: TafsirResource[];
  sectionsToRender: Array<{ language: string; items: TafsirResource[] }>;
} => {
  const resourcesToRender = activeFilter === 'All' ? tafsirs : groupedTafsirs[activeFilter] || [];

  const languageIndex = new Map(languages.map((lang, idx) => [lang, idx]));
  const sectionsToRender =
    activeFilter === 'All'
      ? Object.entries(groupedTafsirs)
          .sort(
            ([langA], [langB]) =>
              (languageIndex.get(langA) ?? Number.POSITIVE_INFINITY) -
              (languageIndex.get(langB) ?? Number.POSITIVE_INFINITY)
          )
          .map(([language, items]) => ({
            language,
            items,
          }))
      : [{ language: activeFilter, items: resourcesToRender }];

  return {
    resourcesToRender,
    sectionsToRender,
  };
};
