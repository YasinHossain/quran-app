import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import { getTafsirCached } from '@/lib/tafsir/tafsirCache';
import { GetTafsirResourcesUseCase } from '@/src/application/use-cases/GetTafsirResources';
import { container } from '@/src/infrastructure/di/Container';

export type TafsirTab = { id: number; name: string };

export type UseTafsirTabsStateReturn = {
  tabs: TafsirTab[];
  activeId: number | undefined;
  setActiveId: React.Dispatch<React.SetStateAction<number | undefined>>;
  contents: Record<number, string>;
  loading: Record<number, boolean>;
};

export function useTafsirTabsState(
  verseKey: string,
  tafsirIds: number[]
): UseTafsirTabsStateReturn {
  const repository = container.getTafsirRepository();
  const resourcesUseCase = new GetTafsirResourcesUseCase(repository);

  const { data } = useSWR('tafsir:resources:all', async () => {
    const result = await resourcesUseCase.execute();
    return result.tafsirs.map((t) => ({ id: t.id, name: t.displayName, lang: t.language }));
  });

  const tabs: TafsirTab[] = useMemo(() => {
    const resources = data || [];
    return tafsirIds
      .map((id) => resources.find((r) => r.id === id))
      .filter(Boolean)
      .slice(0, 3) as TafsirTab[];
  }, [tafsirIds, data]);

  const [activeId, setActiveId] = useState<number | undefined>(() => {
    return tabs.length > 0 ? tabs[0]?.id : undefined;
  });

  useEffect(() => {
    if (tabs.length > 0 && !tabs.find((t) => t.id === activeId)) {
      setActiveId(tabs[0]!.id);
    }
  }, [tabs, activeId]);

  const [contents, setContents] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!activeId) return;
    if (contents[activeId]) return;
    setLoading((l) => ({ ...l, [activeId]: true }));
    getTafsirCached(verseKey, activeId)
      .then((text) => setContents((c) => ({ ...c, [activeId]: text })))
      .catch(() => setContents((c) => ({ ...c, [activeId]: 'Error loading tafsir.' })))
      .finally(() => setLoading((l) => ({ ...l, [activeId]: false })));
  }, [activeId, verseKey, contents]);

  return { tabs, activeId, setActiveId, contents, loading } as const;
}
