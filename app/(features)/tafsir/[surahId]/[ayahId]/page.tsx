'use client';
import React from 'react';

import { SettingsSidebar } from '@/app/(features)/surah/components';
import { SurahWorkspaceNavigation } from '@/app/(features)/surah/components/surah-view/SurahWorkspaceNavigation';
import { useTafsirVerseData } from '@/app/(features)/tafsir/hooks/useTafsirVerseData';
import { useBodyScrollLock } from '@/app/providers/hooks/useBodyScrollLock';
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
    navigate,
    currentSurah,
  } = useTafsirVerseData(surahId, ayahId);

  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = React.useState(false);
  const [isTafsirPanelOpen, setIsTafsirPanelOpen] = React.useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = React.useState(false);

  const openTranslationPanel = React.useCallback(() => setIsTranslationPanelOpen(true), []);
  const closeTranslationPanel = React.useCallback(() => setIsTranslationPanelOpen(false), []);
  const openTafsirPanel = React.useCallback(() => setIsTafsirPanelOpen(true), []);
  const closeTafsirPanel = React.useCallback(() => setIsTafsirPanelOpen(false), []);
  const openWordPanel = React.useCallback(() => setIsWordPanelOpen(true), []);
  const closeWordPanel = React.useCallback(() => setIsWordPanelOpen(false), []);

  useBodyScrollLock(true);

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
              navigate={navigate}
              currentSurah={currentSurah}
              ayahId={ayahId}
              verse={verse}
              tafsirResource={tafsirResource}
              tafsirHtml={tafsirHtml}
            />
          </WorkspaceMain>
        }
        right={
          <SettingsSidebarContent
            readerTabsEnabled={false}
            showTafsirSetting
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
  navigate,
  currentSurah,
  ayahId,
  verse,
  tafsirResource,
  tafsirHtml,
}: {
  surahId: string;
  prev: { surahId: string; ayahId: number } | null;
  next: { surahId: string; ayahId: number } | null;
  navigate: (target: { surahId: string; ayahId: number } | null) => void;
  currentSurah: Surah | undefined;
  ayahId: string;
  verse: Parameters<typeof TafsirViewer>[0]['verse'];
  tafsirResource: Parameters<typeof TafsirViewer>[0]['tafsirResource'];
  tafsirHtml: Parameters<typeof TafsirViewer>[0]['tafsirHtml'];
}): React.JSX.Element {
  const touchStart = React.useRef<{ x: number; y: number } | null>(null);

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
        if (next) navigate(next);
      } else {
        // Swipe Right -> Prev
        if (prev) navigate(prev);
      }
    }
    touchStart.current = null;
  };

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="min-h-full touch-pan-y">
      <AyahNavigation
        prev={prev}
        next={next}
        navigate={navigate}
        {...(currentSurah !== undefined ? { currentSurah } : {})}
        ayahId={ayahId}
        surahId={surahId}
      />
      <TafsirViewer
        {...(verse !== undefined ? { verse } : {})}
        {...(tafsirResource !== undefined ? { tafsirResource } : {})}
        {...(tafsirHtml !== undefined ? { tafsirHtml } : {})}
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
