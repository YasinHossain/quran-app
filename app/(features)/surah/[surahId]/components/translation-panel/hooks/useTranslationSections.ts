import { TranslationResource } from '@/types';

export const useTranslationSections = (
  activeFilter: string,
  translations: TranslationResource[],
  groupedTranslations: Record<string, TranslationResource[]>
) => {
  const resourcesToRender =
    activeFilter === 'All' ? translations : groupedTranslations[activeFilter] || [];

  // Create sections for rendering with headers, ordered as English, Bengali, then alphabetical
  const sectionsToRender =
    activeFilter === 'All'
      ? Object.entries(groupedTranslations)
          .sort(([langA], [langB]) => {
            // English first
            if (langA === 'English') return -1;
            if (langB === 'English') return 1;
            // Bengali second
            if (langA === 'Bengali') return -1;
            if (langB === 'Bengali') return 1;
            // Then alphabetical
            return langA.localeCompare(langB);
          })
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
