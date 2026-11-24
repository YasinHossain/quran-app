'use client';
import { useEffect, useRef, useState } from 'react';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useSettings } from '@/app/providers/SettingsContext';
import { applyArabicFont } from '@/lib/tafsir/applyArabicFont';

import { TafsirSkeleton } from './TafsirSkeleton';
import { useTafsirTabsState } from './useTafsirTabsState';

interface TafsirTabsProps {
  verseKey: string;
  tafsirIds: number[];
  onAddTafsir?: (() => void) | undefined;
}

const MAX_TAFSIR_TABS = 3;

export function TafsirTabs({
  verseKey,
  tafsirIds,
  onAddTafsir,
}: TafsirTabsProps): React.JSX.Element {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { tabs, activeId, setActiveId, contents, loading } = useTafsirTabsState(
    verseKey,
    tafsirIds
  );

  // Track content container ref for height measurement
  const contentRef = useRef<HTMLDivElement>(null);
  // Store the last known content height to prevent layout shift during loading
  const [stableHeight, setStableHeight] = useState<number>(0);

  // Capture content height when loaded content is rendered
  useEffect(() => {
    if (!loading[activeId ?? 0] && contentRef.current && contents[activeId ?? 0]) {
      // Use requestAnimationFrame to ensure accurate measurement after paint
      requestAnimationFrame(() => {
        if (contentRef.current) {
          const height = contentRef.current.offsetHeight;
          if (height > 0) {
            setStableHeight(height);
          }
        }
      });
    }
  }, [loading, activeId, contents]);

  if (!tabs.length) {
    return <div className="p-4 text-center text-muted">{t('tafsir_no_resources')}</div>;
  }

  if (!activeId) {
    return <div className="p-4 text-center text-muted">{t('tafsir_loading')}</div>;
  }

  const activeTab = tabs.find((t) => t.id === activeId);
  const isLoading = !!loading[activeId];

  return (
    <div>
      <TabsHeader
        tabs={tabs}
        activeId={activeId}
        onSelect={setActiveId}
        onAddTafsir={onAddTafsir}
      />
      {/* Wrapper div maintains stable height during loading to prevent layout shift */}
      <div style={stableHeight > 0 ? { minHeight: `${stableHeight}px` } : undefined}>
        <TafsirContent
          ref={contentRef}
          title={activeTab?.name || ''}
          isLoading={isLoading}
          html={applyArabicFont(contents[activeId] || '', settings.arabicFontFace)}
          fontSizePx={settings.tafsirFontSize}
        />
      </div>
    </div>
  );
}

function TabsHeader({
  tabs,
  activeId,
  onSelect,
  onAddTafsir,
}: {
  tabs: { id: number; name: string }[];
  activeId: number | undefined;
  onSelect: (id: number) => void;
  onAddTafsir?: (() => void) | undefined;
}): React.JSX.Element {
  const { t } = useTranslation();
  const showAddButton = onAddTafsir && tabs.length < MAX_TAFSIR_TABS;

  return (
    <div
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      className="flex w-full flex-nowrap items-center p-1 rounded-full bg-interactive border border-border mx-0 sm:mx-4 overflow-x-auto scrollbar-hide gap-1"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={`flex-1 text-center py-2.5 px-4 sm:py-3 sm:px-5 rounded-full text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
            activeId === tab.id
              ? 'bg-surface shadow text-foreground'
              : 'text-muted hover:text-foreground hover:bg-surface/30'
          }`}
        >
          {tab.name}
        </button>
      ))}
      {showAddButton && (
        <button
          onClick={onAddTafsir}
          className="flex-1 text-center py-2.5 px-4 sm:py-3 sm:px-5 rounded-full text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap text-muted hover:text-foreground hover:bg-surface/30 border border-dashed border-border/50"
        >
          {t('add_tafsir')}
        </button>
      )}
    </div>
  );
}

interface TafsirContentProps {
  title: string;
  isLoading: boolean;
  html: string;
  fontSizePx: number;
}

const TafsirContent = forwardRef<HTMLDivElement, TafsirContentProps>(function TafsirContent(
  { title, isLoading, html, fontSizePx },
  ref
) {
  return (
    <div ref={ref} className="p-3 sm:p-4 mt-3 sm:mt-4 w-full">
      <h2 className="mb-6 sm:mb-8 text-center text-lg sm:text-xl font-bold text-foreground">
        {title}
      </h2>
      {isLoading ? (
        <TafsirSkeleton />
      ) : (
        <div
          className="prose max-w-none tafsir-content break-words"
          style={{ fontSize: `${fontSizePx}px` }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
});
