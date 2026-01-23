'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

import { SettingsSidebar } from '@/app/(features)/surah/components';
import { SurahWorkspaceNavigation } from '@/app/(features)/surah/components/surah-view/SurahWorkspaceNavigation';
import { useTafsirVerseData } from '@/app/(features)/tafsir/hooks/useTafsirVerseData';
import { useUIState } from '@/app/providers/UIStateContext';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import { ThreeColumnWorkspace, WorkspaceMain } from '@/app/shared/reader';
import { SettingsSidebarContent } from '@/app/shared/reader/settings/SettingsSidebarContent';
import { SurahListSidebar } from '@/app/shared/SurahListSidebar';
import { Surah } from '@/types';

import { AyahNavigation } from './components/AyahNavigation';
import { TafsirAudioPlayer } from './components/TafsirAudioPlayer';
import { TafsirViewer } from './components/TafsirViewer';

interface TafsirVersePageProps {
  params: Promise<{ surahId: string; ayahId: string }>;
}

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

export default function TafsirVersePage({ params }: TafsirVersePageProps): React.JSX.Element {
  const { surahId, ayahId } = React.use(params);
  const { activeVerse, isPlayerVisible, reciter } = useAudio();
  const {
    verse,
    tafsirHtml,
    tafsirResource,
    selectedTranslationName,
    selectedTafsirName,
    selectedWordLanguageName,
    prev,
    next,
    currentSurah,
  } = useTafsirVerseData(surahId, ayahId);

  const [isTranslationPanelOpen, openTranslationPanel, closeTranslationPanel] =
    useUIPanelVisibility(TRANSLATION_PANEL_ID);
  const [isTafsirPanelOpen, openTafsirPanel, closeTafsirPanel] =
    useUIPanelVisibility(TAFSIR_PANEL_ID);
  const [isWordPanelOpen, openWordPanel, closeWordPanel] =
    useUIPanelVisibility(WORD_LANGUAGE_PANEL_ID);

  // Get setSettingsOpen to open settings sidebar on mobile
  const { setSettingsOpen } = useUIState();

  // Handle Add Tafsir click - opens settings sidebar (for mobile) and tafsir panel
  const handleAddTafsir = React.useCallback(() => {
    setSettingsOpen(true);
    openTafsirPanel();
  }, [setSettingsOpen, openTafsirPanel]);

  return (
    <>
      <div className="lg:hidden">
        <SurahListSidebar />
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

      <ThreeColumnWorkspace
        left={<SurahWorkspaceNavigation />}
        center={
          <WorkspaceMain data-slot="tafsir-workspace-main" contentClassName="pt-4">
            <TafsirContent
              surahId={surahId}
              prev={prev}
              next={next}
              currentSurah={currentSurah}
              ayahId={ayahId}
              verse={verse}
              tafsirResource={tafsirResource}
              tafsirHtml={tafsirHtml}
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
  prev,
  next,
  currentSurah,
  ayahId,
  verse,
  tafsirResource,
  tafsirHtml,
  onAddTafsir,
}: {
  surahId: string;
  prev: { surahId: string; ayahId: number } | null;
  next: { surahId: string; ayahId: number } | null;
  currentSurah: Surah | undefined;
  ayahId: string;
  verse: Parameters<typeof TafsirViewer>[0]['verse'];
  tafsirResource: Parameters<typeof TafsirViewer>[0]['tafsirResource'];
  tafsirHtml: Parameters<typeof TafsirViewer>[0]['tafsirHtml'];
  onAddTafsir: () => void;
}): React.JSX.Element {
  const router = useRouter();
  const touchStart = React.useRef<{ x: number; y: number } | null>(null);

  const navigateTo = React.useCallback(
    (target: { surahId: string; ayahId: number }) => {
      // Use Next.js router for client-side navigation (faster than full page reload)
      router.push(`/tafsir/${target.surahId}/${target.ayahId}`);
    },
    [router]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touch = e.changedTouches[0];
    if (!touch) return;

    const touchEnd = { x: touch.clientX, y: touch.clientY };
    const diffX = touchStart.current.x - touchEnd.x;
    const diffY = touchStart.current.y - touchEnd.y;

    // Threshold for swipe (50px) and check if horizontal swipe is dominant
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        // Swipe Left -> Next
        if (next) navigateTo(next);
      } else {
        // Swipe Right -> Prev
        if (prev) navigateTo(prev);
      }
    }
    touchStart.current = null;
  };

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="min-h-full touch-pan-y">
      <AyahNavigation
        prev={prev}
        next={next}
        {...(currentSurah !== undefined ? { currentSurah } : {})}
        ayahId={ayahId}
        surahId={surahId}
      />
      <TafsirViewer
        {...(verse !== undefined ? { verse } : {})}
        {...(tafsirResource !== undefined ? { tafsirResource } : {})}
        {...(tafsirHtml !== undefined ? { tafsirHtml } : {})}
        onAddTafsir={onAddTafsir}
      />
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
