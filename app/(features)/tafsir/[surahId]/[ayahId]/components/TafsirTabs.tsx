'use client';
import { useEffect, useState, useMemo } from 'react';
import Spinner from '@/app/shared/Spinner';
import { getTafsirCached } from '@/lib/tafsir/tafsirCache';
import { getTafsirResources } from '@/lib/api';
import { applyArabicFont } from '@/lib/tafsir/applyArabicFont';
import useSWR from 'swr';
import { useSettings } from '@/app/providers/SettingsContext';

interface TafsirTabsProps {
  verseKey: string;
  tafsirIds: number[];
}

export default function TafsirTabs({ verseKey, tafsirIds }: TafsirTabsProps) {
  const { data } = useSWR('tafsirs', getTafsirResources);
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
    return tabs.length > 0 ? tabs[0].id : undefined;
  });

  useEffect(() => {
    // If tabs exist and activeId is not in them, set to first tab
    if (tabs.length > 0 && !tabs.find((t) => t.id === activeId)) {
      setActiveId(tabs[0].id);
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
      <div className="flex w-full items-center p-1 rounded-full bg-interactive ml-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={`flex-1 text-center py-3 px-5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
              activeId === t.id ? 'bg-surface shadow text-primary' : 'text-muted hover:text-primary'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div className="p-4 mt-4">
        <h2 className="mb-8 text-center text-xl font-bold text-primary">{activeTab?.name}</h2>
        {loading[activeId] ? (
          <div className="flex justify-center py-4">
            <Spinner className="h-5 w-5 text-accent" />
          </div>
        ) : (
          <div
            className="prose max-w-none tafsir-content"
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
