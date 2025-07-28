'use client';
import { useEffect, useState } from 'react';
import Spinner from '@/app/components/common/Spinner';
import { getTafsirCached } from '@/lib/tafsirCache';

interface TabInfo {
  id: number;
  name: string;
}

interface TafsirTabsProps {
  verseKey: string;
  tabs: TabInfo[];
}

export default function TafsirTabs({ verseKey, tabs }: TafsirTabsProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
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

  if (!tabs.length) return null;

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
            className={`flex-1 p-3 text-sm font-medium focus:outline-none ${activeId === t.id ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-500'}`}
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
