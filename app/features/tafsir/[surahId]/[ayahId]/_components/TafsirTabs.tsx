'use client';
import { useEffect, useState, useMemo } from 'react';
import Spinner from '@/app/components/common/Spinner';
import { getTafsirCached } from '@/lib/tafsirCache';
import { getTafsirResources } from '@/lib/api';
import { applyArabicFont } from '@/lib/applyArabicFont';
import useSWR from 'swr';
import { useTheme } from '@/app/context/ThemeContext';
import { useSettings } from '@/app/context/SettingsContext';

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

  const { theme } = useTheme();
  if (!tabs.length || !activeId) return null;

  return (
    <div>
      <div
        className={`flex w-full items-center p-1 rounded-full ${theme === 'light' ? 'bg-gray-100' : 'bg-slate-800/60'} ml-4`}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={`flex-1 text-center py-3 px-5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
              activeId === t.id
                ? theme === 'light'
                  ? 'bg-white shadow text-slate-900'
                  : 'bg-slate-700 text-white shadow'
                : theme === 'light'
                  ? 'text-slate-500 hover:text-slate-800'
                  : 'text-slate-400 hover:text-white'
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
            className="prose max-w-none whitespace-pre-wrap"
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
