import {
  useEffect,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
  type UIEvent,
} from 'react';

import { useSidebar } from '@/app/providers/SidebarContext';
import { useSurahTabConfig } from '@/app/shared/components/surah-tabs/useSurahTabConfig';
import { useSurahTabParams } from '@/app/shared/components/surah-tabs/useSurahTabParams';
import { useSelectionSync } from '@/app/shared/surah-sidebar/hooks/useSelectionSync';
import { useSidebarScroll } from '@/app/shared/surah-sidebar/useSidebarScroll';

import type { TabKey } from '@/app/shared/components/surah-tabs/types';
import type { Chapter } from '@/types';

export interface SurahTabsState {
  tabs: { key: TabKey; label: string }[];
  activeTab: TabKey;
  setActiveTab: Dispatch<SetStateAction<TabKey>>;
  selectedSurahId: number | null;
  setSelectedSurahId: (id: number | null) => void;
  selectedJuzId: number | null;
  setSelectedJuzId: (id: number | null) => void;
  selectedPageId: number | null;
  setSelectedPageId: (id: number | null) => void;
  scrollRef: RefObject<HTMLDivElement>;
  handleScroll: (e: UIEvent<HTMLDivElement>) => void;
  prepareForTabSwitch: (tab: TabKey) => void;
  rememberScroll: (tab: TabKey) => void;
  isTafsirPath: boolean;
}

export function useSurahTabsState(chapters: ReadonlyArray<Chapter>): SurahTabsState {
  const { currentSurahId, currentJuzId, currentPageId, isTafsirPath, getInitialTab } =
    useSurahTabParams();
  const { tabs } = useSurahTabConfig();
  const [activeTab, setActiveTab] = useState<TabKey>(getInitialTab);
  const { isSurahListOpen } = useSidebar();
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (isSurahListOpen) setHasOpened(true);
  }, [isSurahListOpen]);

  const {
    selectedSurahId,
    setSelectedSurahId,
    selectedJuzId,
    setSelectedJuzId,
    selectedPageId,
    setSelectedPageId,
  } = useSelectionSync({
    currentSurahId,
    currentJuzId,
    currentPageId,
    chapters,
  });

  const { scrollRef, handleScroll, prepareForTabSwitch, rememberScroll } = useSidebarScroll({
    activeTab,
    selectedSurahId,
    selectedJuzId,
    selectedPageId,
    isEnabled: isSurahListOpen || hasOpened,
  });

  return {
    tabs,
    activeTab,
    setActiveTab,
    selectedSurahId,
    setSelectedSurahId,
    selectedJuzId,
    setSelectedJuzId,
    selectedPageId,
    setSelectedPageId,
    scrollRef,
    handleScroll,
    prepareForTabSwitch,
    rememberScroll,
    isTafsirPath,
  };
}
