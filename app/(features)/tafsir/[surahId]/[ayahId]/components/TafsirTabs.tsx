'use client';
import { useSettings } from '@/app/providers/SettingsContext';
import { Spinner } from '@/app/shared/Spinner';
import { applyArabicFont } from '@/lib/tafsir/applyArabicFont';

import { useTafsirTabsState } from './useTafsirTabsState';

interface TafsirTabsProps {
  verseKey: string;
  tafsirIds: number[];
}

export function TafsirTabs({ verseKey, tafsirIds }: TafsirTabsProps): React.JSX.Element {
  const { settings } = useSettings();
  const { tabs, activeId, setActiveId, contents, loading } = useTafsirTabsState(
    verseKey,
    tafsirIds
  );

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
      <TabsHeader tabs={tabs} activeId={activeId} onSelect={setActiveId} />
      <TafsirContent
        title={activeTab?.name || ''}
        isLoading={!!loading[activeId]}
        html={applyArabicFont(contents[activeId] || '', settings.arabicFontFace)}
        fontSizePx={settings.tafsirFontSize}
      />
    </div>
  );
}

function TabsHeader({
  tabs,
  activeId,
  onSelect,
}: {
  tabs: { id: number; name: string }[];
  activeId: number | undefined;
  onSelect: (id: number) => void;
}): React.JSX.Element {
  return (
    <div className="flex w-full flex-nowrap items-center p-1 rounded-full bg-interactive border border-border mx-0 sm:mx-4 overflow-x-auto scrollbar-hide gap-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
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
  );
}

function TafsirContent({
  title,
  isLoading,
  html,
  fontSizePx,
}: {
  title: string;
  isLoading: boolean;
  html: string;
  fontSizePx: number;
}): React.JSX.Element {
  return (
    <div className="p-3 sm:p-4 mt-3 sm:mt-4 w-full">
      <h2 className="mb-6 sm:mb-8 text-center text-lg sm:text-xl font-bold text-foreground">
        {title}
      </h2>
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Spinner className="h-5 w-5 text-accent" />
        </div>
      ) : (
        <div
          className="prose max-w-none tafsir-content break-words"
          style={{ fontSize: `${fontSizePx}px` }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
}
