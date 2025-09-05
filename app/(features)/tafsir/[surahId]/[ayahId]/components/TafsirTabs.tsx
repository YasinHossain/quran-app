'use client';
import { useEffect, useState, useMemo } from 'react';
import useSWR from 'swr';

import { useSettings } from '@/app/providers/SettingsContext';
import { Spinner } from '@/app/shared/Spinner';
import { applyArabicFont } from '@/lib/tafsir/applyArabicFont';
import { getTafsirCached } from '@/lib/tafsir/tafsirCache';
import { GetTafsirResourcesUseCase } from '@/src/application/use-cases/GetTafsirResources';
import { container } from '@/src/infrastructure/di/Container';

interface TafsirTabsProps {
  verseKey: string;
  tafsirIds: number[];
}

export function TafsirTabs({ verseKey, tafsirIds }: TafsirTabsProps) {
  const repository = container.getTafsirRepository();
  const resourcesUseCase = new GetTafsirResourcesUseCase(repository);

  // Use a distinct SWR key and the unified fetcher to avoid cache collisions
  const { data } = useSWR('tafsir:resources:all', async () => {
    const result = await resourcesUseCase.execute();
    return result.tafsirs.map((t) => ({ id: t.id, name: t.displayName, lang: t.language }));
  });
  const { settings } = useSettings();

  // Compute tabs only when data or tafsirIds change
  const tabs = useMemo(() => {
    const resources = data || [];
    return tafsirIds
      .map((id) => resources.find((r) => r.id === id))
      .filter(Boolean)
      .slice(0, 3) as { id: number; name: string }[];
  }, [tafsirIds, data]);

  // Initialize activeId with the first tab when tabs are available
  const [activeId, setActiveId] = useState<number | undefined>(() => {
    return tabs.length > 0 ? tabs[0]?.id : undefined;
  });

  useEffect(() => {
    // If tabs exist and activeId is not in them, set to first tab
    if (tabs.length > 0 && !tabs.find((t) => t.id === activeId)) {
      setActiveId(tabs[0]!.id);
    }
  }, [tabs, activeId]);

  // -- Caching and loading state --
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

  if (!tabs.length) {
    return (
      <div className="p-4 text-center text-muted">
        No tafsir resources available. Please check your settings.
      </div>
    );
  }

  if (!activeId) {
    return <div className="p-4 text-center text-muted">Loading tafsir...</div>;
  }

  const activeTab = tabs.find((t) => t.id === activeId);

  return (
    <div>
      <div className="flex w-full flex-nowrap items-center p-1 rounded-full bg-interactive border border-border mx-0 sm:mx-4 overflow-x-auto scrollbar-hide gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={`flex-1 text-center py-2.5 px-4 sm:py-3 sm:px-5 rounded-full text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
              activeId === t.id
                ? 'bg-surface shadow text-foreground'
                : 'text-muted hover:text-foreground hover:bg-surface/30'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div className="p-3 sm:p-4 mt-3 sm:mt-4 w-full">
        <h2 className="mb-6 sm:mb-8 text-center text-lg sm:text-xl font-bold text-foreground">
          {activeTab?.name}
        </h2>
        {loading[activeId] ? (
          <div className="flex justify-center py-4">
            <Spinner className="h-5 w-5 text-accent" />
          </div>
        ) : (
          <div
            className="prose max-w-none tafsir-content break-words"
            style={{
              fontSize: `${settings.tafsirFontSize}px`,
            }}
            dangerouslySetInnerHTML={{
              __html: applyArabicFont(contents[activeId] || '', settings.arabicFontFace),
            }}
          />
        )}
      </div>
    </div>
  );
}
