import { Tafsir } from '../tafsirPanel.utils';

export const useTafsirSections = (
  activeFilter: string,
  tafsirs: Tafsir[],
  groupedTafsirs: Record<string, Tafsir[]>
) => {
  const resourcesToRender = activeFilter === 'All' ? tafsirs : groupedTafsirs[activeFilter] || [];

  return {
    resourcesToRender,
  };
};
