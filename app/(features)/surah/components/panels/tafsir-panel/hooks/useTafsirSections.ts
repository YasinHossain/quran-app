import { TafsirResource } from '@/types';

export const useTafsirSections = (
  activeFilter: string,
  tafsirs: TafsirResource[],
  groupedTafsirs: Record<string, TafsirResource[]>
): { resourcesToRender: TafsirResource[] } => {
  const resourcesToRender = activeFilter === 'All' ? tafsirs : groupedTafsirs[activeFilter] || [];

  return {
    resourcesToRender,
  };
};
