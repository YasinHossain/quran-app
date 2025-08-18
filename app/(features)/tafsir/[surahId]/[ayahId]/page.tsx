'use client';
import React, { useState } from 'react';
import { SettingsSidebar } from '@/app/(features)/surah/[surahId]/components/SettingsSidebar';
import { useTafsirVerseData } from '../../hooks/useTafsirVerseData';
import AyahNavigation from './components/AyahNavigation';
import TafsirViewer from './components/TafsirViewer';

interface TafsirVersePageProps {
  params: Promise<{ surahId: string; ayahId: string }>;
}

export default function TafsirVersePage({ params }: TafsirVersePageProps) {
  const { surahId, ayahId } = React.use(params);
  const {
    verse,
    tafsirHtml,
    tafsirResource,
    wordLanguageOptions,
    selectedTranslationName,
    selectedTafsirName,
    selectedWordLanguageName,
    prev,
    next,
    navigate,
    currentSurah,
    resetWordSettings,
  } = useTafsirVerseData(surahId, ayahId);

  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [isTafsirPanelOpen, setIsTafsirPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);

  return (
    <div className="flex flex-grow bg-background text-foreground font-sans overflow-hidden min-h-0">
      <main className="flex-grow bg-background section overflow-y-auto homepage-scrollable-area">
        <div className="w-full space-y-6">
          <AyahNavigation
            prev={prev}
            next={next}
            navigate={navigate}
            currentSurah={currentSurah}
            ayahId={ayahId}
          />
          <TafsirViewer verse={verse} tafsirResource={tafsirResource} tafsirHtml={tafsirHtml} />
        </div>
      </main>

      <SettingsSidebar
        onTranslationPanelOpen={() => setIsTranslationPanelOpen(true)}
        onWordLanguagePanelOpen={() => setIsWordPanelOpen(true)}
        onTafsirPanelOpen={() => setIsTafsirPanelOpen(true)}
        selectedTranslationName={selectedTranslationName}
        selectedTafsirName={selectedTafsirName}
        selectedWordLanguageName={selectedWordLanguageName}
        showTafsirSetting
        isTranslationPanelOpen={isTranslationPanelOpen}
        onTranslationPanelClose={() => setIsTranslationPanelOpen(false)}
        isTafsirPanelOpen={isTafsirPanelOpen}
        onTafsirPanelClose={() => setIsTafsirPanelOpen(false)}
        isWordLanguagePanelOpen={isWordPanelOpen}
        onWordLanguagePanelClose={() => setIsWordPanelOpen(false)}
        pageType="tafsir"
      />
    </div>
  );
}
