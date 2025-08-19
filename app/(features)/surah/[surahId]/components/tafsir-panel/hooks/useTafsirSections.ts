export const useTafsirSections = (
  activeFilter: string,
  tafsirs: any[],
  groupedTafsirs: Record<string, any[]>
) => {
  const resourcesToRender = activeFilter === 'All' ? tafsirs : groupedTafsirs[activeFilter] || [];

  return {
    resourcesToRender,
  };
};
