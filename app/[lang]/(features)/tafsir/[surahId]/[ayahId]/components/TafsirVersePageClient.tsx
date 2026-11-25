'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { SettingsSidebar } from '@/app/[lang]/(features)/surah/components';
import { SurahWorkspaceNavigation } from '@/app/[lang]/(features)/surah/components/surah-view/SurahWorkspaceNavigation';
import { useTafsirDocumentTitle } from '@/app/[lang]/(features)/tafsir/hooks/useTafsirDocumentTitle';
import { useTafsirVerseData } from '@/app/[lang]/(features)/tafsir/hooks/useTafsirVerseData';
import {
  parseTafsirPathname,
  type TafsirNavTarget,
} from '@/app/[lang]/(features)/tafsir/hooks/useVerseNavigation';
import { useSettings } from '@/app/providers/SettingsContext';
import { useUIState } from '@/app/providers/UIStateContext';
import { usePublicPathname } from '@/app/shared/i18n/usePublicPathname';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import { ThreeColumnWorkspace, WorkspaceMain } from '@/app/shared/reader';
import { useMinWidth } from '@/app/shared/reader/ReaderLayouts';
import { SettingsSidebarContent } from '@/app/shared/reader/settings/SettingsSidebarContent';
import { SurahListSidebar } from '@/app/shared/SurahListSidebar';

import { AyahNavigation } from './AyahNavigation';
import { TafsirAudioPlayer } from './TafsirAudioPlayer';
import { TafsirSkeleton } from './TafsirSkeleton';
import { TafsirViewer } from './TafsirViewer';

import type { Surah, TafsirResource, Verse } from '@/types';

const TRANSLATION_PANEL_ID = 'tafsir:translation-panel';
const TAFSIR_PANEL_ID = 'tafsir:tafsir-panel';
const WORD_LANGUAGE_PANEL_ID = 'tafsir:word-language-panel';

const useUIPanelVisibility = (panelId: string): [boolean, () => void, () => void] => {
  const { isPanelOpen, openPanel, closePanel } = useUIState();
  const isOpen = isPanelOpen(panelId);
  const open = React.useCallback(() => openPanel(panelId), [openPanel, panelId]);
  const close = React.useCallback(() => closePanel(panelId), [closePanel, panelId]);
  return [isOpen, open, close];
};

export default function TafsirVersePageClient({
  surahId: serverSurahId,
  ayahId: serverAyahId,
  initialVerse,
  initialTafsirHtml,
  initialTafsirResource,
  initialPrev = null,
  initialNext = null,
}: {
  surahId: string;
  ayahId: string;
  initialVerse: Verse;
  initialTafsirHtml: string;
  initialTafsirResource?: TafsirResource | undefined;
  /** Server-computed neighbours, so the first HTML has real prev/next links for crawlers. */
  initialPrev?: TafsirNavTarget | null;
  initialNext?: TafsirNavTarget | null;
}): React.JSX.Element {
  const { activeVerse, isPlayerVisible, reciter } = useAudio();
  const pathname = usePublicPathname();

  // Next/Previous switch verses with `pushState`, so the URL names the verse on screen. The
  // server props only describe the verse this page was rendered for.
  const { surahId, ayahId } = useMemo(
    () => parseTafsirPathname(pathname) ?? { surahId: serverSurahId, ayahId: serverAyahId },
    [pathname, serverAyahId, serverSurahId]
  );
  const isServerVerse = surahId === serverSurahId && ayahId === serverAyahId;

  const tafsirDefaults = useMemo(
    () => ({
      verse: initialVerse,
      tafsirHtml: initialTafsirHtml,
      tafsirResource: initialTafsirResource,
    }),
    [initialTafsirHtml, initialTafsirResource, initialVerse]
  );

  const {
    verse,
    tafsirHtml,
    tafsirResource,
    error,
    retry,
    selectedTranslationName,
    selectedTafsirName,
    selectedWordLanguageName,
    prev: clientPrev,
    next: clientNext,
    navigate,
    currentSurah,
  } = useTafsirVerseData(surahId, ayahId, tafsirDefaults);

  // The client hook needs the chapter list, which is empty during server rendering.
  const prev = isServerVerse ? (clientPrev ?? initialPrev) : clientPrev;
  const next = isServerVerse ? (clientNext ?? initialNext) : clientNext;
  // Only the server-rendered verse may fall back to the server data; any other verse shows a
  // skeleton until its own data arrives.
  const shownVerse = verse ?? (isServerVerse ? initialVerse : undefined);
  const shownTafsirHtml = tafsirHtml ?? (isServerVerse ? initialTafsirHtml : undefined);

  useTafsirDocumentTitle({
    verse: shownVerse,
    surahId,
    surahSimpleName: currentSurah?.name,
    isServerVerse,
  });

  const [isTranslationPanelOpen, openTranslationPanel, closeTranslationPanel] =
    useUIPanelVisibility(TRANSLATION_PANEL_ID);
  const [isTafsirPanelOpen, openTafsirPanel, closeTafsirPanel] =
    useUIPanelVisibility(TAFSIR_PANEL_ID);
  const [isWordPanelOpen, openWordPanel, closeWordPanel] =
    useUIPanelVisibility(WORD_LANGUAGE_PANEL_ID);

  const { setSettingsOpen } = useUIState();
  const isXlUp = useMinWidth(1280);
  const is2xlUp = useMinWidth(1536);

  const handleAddTafsir = React.useCallback(() => {
    setSettingsOpen(true);
    openTafsirPanel();
  }, [setSettingsOpen, openTafsirPanel]);

  return (
    <>
      {/* Drawers cover the widths where the workspace columns are hidden (left < xl, right < 2xl). */}
      {isXlUp ? null : (
        <div className="xl:hidden">
          <SurahListSidebar />
        </div>
      )}
      {is2xlUp ? null : (
        <div className="2xl:hidden">
          <TafsirSettingsSidebar
            selectedTranslationName={selectedTranslationName}
            selectedTafsirName={selectedTafsirName}
            selectedWordLanguageName={selectedWordLanguageName}
            isTranslationPanelOpen={isTranslationPanelOpen}
            onTranslationPanelOpen={openTranslationPanel}
            onTranslationPanelClose={closeTranslationPanel}
            isTafsirPanelOpen={isTafsirPanelOpen}
            onTafsirPanelOpen={openTafsirPanel}
            onTafsirPanelClose={closeTafsirPanel}
            isWordLanguagePanelOpen={isWordPanelOpen}
            onWordLanguagePanelOpen={openWordPanel}
            onWordLanguagePanelClose={closeWordPanel}
          />
        </div>
      )}

      <ThreeColumnWorkspace
        left={<SurahWorkspaceNavigation />}
        center={
          <WorkspaceMain data-slot="tafsir-workspace-main" contentClassName="pt-4">
            <TafsirContent
              surahId={surahId}
              ayahId={ayahId}
              prev={prev}
              next={next}
              onNavigate={navigate}
              currentSurah={currentSurah}
              verse={shownVerse}
              tafsirResource={tafsirResource ?? initialTafsirResource}
              tafsirHtml={shownTafsirHtml}
              error={error && !isServerVerse}
              onRetry={retry}
              onAddTafsir={handleAddTafsir}
            />
          </WorkspaceMain>
        }
        right={
          <SettingsSidebarContent
            readerTabsEnabled={false}
            showTafsirSetting
            pageType="tafsir"
            selectedTranslationName={selectedTranslationName}
            selectedTafsirName={selectedTafsirName}
            selectedWordLanguageName={selectedWordLanguageName}
            onTranslationPanelOpen={openTranslationPanel}
            onTranslationPanelClose={closeTranslationPanel}
            isTranslationPanelOpen={isTranslationPanelOpen}
            onTafsirPanelOpen={openTafsirPanel}
            onTafsirPanelClose={closeTafsirPanel}
            isTafsirPanelOpen={isTafsirPanelOpen}
            onWordLanguagePanelOpen={openWordPanel}
            onWordLanguagePanelClose={closeWordPanel}
            isWordLanguagePanelOpen={isWordPanelOpen}
          />
        }
      />

      <TafsirAudioPlayer activeVerse={activeVerse} reciter={reciter} isVisible={isPlayerVisible} />
    </>
  );
}

function TafsirContent({
  surahId,
  ayahId,
  prev,
  next,
  onNavigate,
  currentSurah,
  verse,
  tafsirResource,
  tafsirHtml,
  error,
  onRetry,
  onAddTafsir,
}: {
  surahId: string;
  ayahId: string;
  prev: TafsirNavTarget | null;
  next: TafsirNavTarget | null;
  onNavigate: (target: TafsirNavTarget) => void;
  currentSurah: Surah | undefined;
  verse: Verse | undefined;
  tafsirResource: TafsirResource | undefined;
  tafsirHtml: string | undefined;
  error: boolean;
  onRetry: () => void;
  onAddTafsir: () => void;
}): React.JSX.Element {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const touchStart = React.useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent): void => {
    const touch = e.touches[0];
    if (touch) {
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const onTouchEnd = (e: React.TouchEvent): void => {
    if (!touchStart.current) return;
    const touch = e.changedTouches[0];
    if (!touch) return;

    const touchEnd = { x: touch.clientX, y: touch.clientY };
    const diffX = touchStart.current.x - touchEnd.x;
    const diffY = touchStart.current.y - touchEnd.y;

    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        if (next) onNavigate(next);
      } else {
        if (prev) onNavigate(prev);
      }
    }
    touchStart.current = null;
  };

  // A single tafsir is fetched with the verse; tabs (several tafsirs) load their own content.
  const isSingleTafsir = (settings.tafsirIds?.length ?? 0) === 1;
  const isLoading = !verse || (isSingleTafsir && tafsirHtml === undefined);

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="min-h-full touch-pan-y">
      <AyahNavigation
        prev={prev}
        next={next}
        onNavigate={onNavigate}
        {...(currentSurah !== undefined ? { currentSurah } : {})}
        ayahId={ayahId}
        surahId={surahId}
      />
      {error ? (
        <div className="flex flex-col items-center gap-3 p-6 text-center text-muted" role="alert">
          <p>{t('error_loading_tafsir')}</p>
          <button
            type="button"
            onClick={onRetry}
            className="min-h-touch rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-interactive-hover"
          >
            {t('retry')}
          </button>
        </div>
      ) : isLoading ? (
        <div className="mt-4" aria-busy="true" data-testid="tafsir-verse-loading">
          <TafsirSkeleton />
        </div>
      ) : (
        // Keyed by verse so per-verse state (tafsir tabs' loaded content) starts fresh.
        <TafsirViewer
          key={verse.verse_key}
          verse={verse}
          {...(tafsirResource !== undefined ? { tafsirResource } : {})}
          {...(tafsirHtml !== undefined ? { tafsirHtml } : {})}
          onAddTafsir={onAddTafsir}
        />
      )}
    </div>
  );
}

function TafsirSettingsSidebar({
  selectedTranslationName,
  selectedTafsirName,
  selectedWordLanguageName,
  isTranslationPanelOpen,
  onTranslationPanelOpen,
  onTranslationPanelClose,
  isTafsirPanelOpen,
  onTafsirPanelOpen,
  onTafsirPanelClose,
  isWordLanguagePanelOpen,
  onWordLanguagePanelOpen,
  onWordLanguagePanelClose,
}: {
  selectedTranslationName: string;
  selectedTafsirName: string;
  selectedWordLanguageName: string;
  isTranslationPanelOpen: boolean;
  onTranslationPanelOpen: () => void;
  onTranslationPanelClose: () => void;
  isTafsirPanelOpen: boolean;
  onTafsirPanelOpen: () => void;
  onTafsirPanelClose: () => void;
  isWordLanguagePanelOpen: boolean;
  onWordLanguagePanelOpen: () => void;
  onWordLanguagePanelClose: () => void;
}): React.JSX.Element {
  return (
    <SettingsSidebar
      onTranslationPanelOpen={onTranslationPanelOpen}
      onWordLanguagePanelOpen={onWordLanguagePanelOpen}
      onTafsirPanelOpen={onTafsirPanelOpen}
      selectedTranslationName={selectedTranslationName}
      selectedTafsirName={selectedTafsirName}
      selectedWordLanguageName={selectedWordLanguageName}
      showTafsirSetting
      isTranslationPanelOpen={isTranslationPanelOpen}
      onTranslationPanelClose={onTranslationPanelClose}
      isTafsirPanelOpen={isTafsirPanelOpen}
      onTafsirPanelClose={onTafsirPanelClose}
      isWordLanguagePanelOpen={isWordLanguagePanelOpen}
      onWordLanguagePanelClose={onWordLanguagePanelClose}
      pageType="tafsir"
    />
  );
}
