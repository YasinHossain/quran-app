'use client';
import { useEffect, useState, useMemo } from 'react';
import Spinner from '@/app/components/common/Spinner';
import { getTafsirCached } from '@/lib/tafsirCache';
import { getTafsirResources } from '@/lib/api';
import useSWR from 'swr';

interface TafsirTabsProps {
  verseKey: string;
  tafsirIds: number[];
}

export default function TafsirTabs({ verseKey, tafsirIds }: TafsirTabsProps) {
  const { data } = useSWR('tafsirs', getTafsirResources);

  // Compute tabs only when data or tafsirIds change
  const tabs = useMemo(() => {
    const resources = data || [];
    return tafsirIds
      .map((id) => resources.find((r) => r.id === id))
      .filter(Boolean)
      .slice(0, 3) as { id: number; name: string }[];
  }, [tafsirIds, data]);

  // -- Fix 1: activeId needs to track the tabs --
  const [activeId, setActiveId] = useState<number | undefined>(undefined);

  useEffect(() => {
    // If tabs exist and activeId is not in them, set to first tab
    if (tabs.length && !tabs.find((t) => t.id === activeId)) {
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

  if (!tabs.length || !activeId) return null;

  return (
    <div className="bg-white rounded-md border shadow">
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg text-gray-800">Tafsir</h2>
        <p className="text-sm text-gray-500">Commentary and explanation of the verse.</p>
      </div>
      <div className="flex border-b">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={`flex-1 p-3 text-sm font-medium focus:outline-none ${
              activeId === t.id ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-500'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div className="p-4">
        {loading[activeId] ? (
          <div className="flex justify-center py-4">
            <Spinner className="h-5 w-5 text-emerald-600" />
          </div>
        ) : (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: contents[activeId] || '' }}
          />
        )}
      </div>
    </div>
  );
}
