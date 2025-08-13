import { useRef, useLayoutEffect, useEffect } from 'react';
import { useSidebar } from '@/app/providers/SidebarContext';

type TabKey = 'Surah' | 'Juz' | 'Page';

interface Options {
  activeTab: TabKey;
  selectedSurahId: string | null;
  selectedJuzId: string | null;
  selectedPageId: string | null;
}

const useSidebarScroll = ({
  activeTab,
  selectedSurahId,
  selectedJuzId,
  selectedPageId,
}: Options) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    surahScrollTop,
    setSurahScrollTop,
    juzScrollTop,
    setJuzScrollTop,
    pageScrollTop,
    setPageScrollTop,
  } = useSidebar();

  const shouldCenterRef = useRef<Record<TabKey, boolean>>({
    Surah: true,
    Juz: true,
    Page: true,
  });

  useLayoutEffect(() => {
    const surahSkipped = sessionStorage.getItem('skipCenterSurah') === '1';
    const juzSkipped = sessionStorage.getItem('skipCenterJuz') === '1';
    const pageSkipped = sessionStorage.getItem('skipCenterPage') === '1';
    if (surahSkipped) {
      shouldCenterRef.current.Surah = false;
      sessionStorage.removeItem('skipCenterSurah');
    }
    if (juzSkipped) {
      shouldCenterRef.current.Juz = false;
      sessionStorage.removeItem('skipCenterJuz');
    }
    if (pageSkipped) {
      shouldCenterRef.current.Page = false;
      sessionStorage.removeItem('skipCenterPage');
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'Surah') shouldCenterRef.current.Surah = true;
  }, [selectedSurahId, activeTab]);
  useEffect(() => {
    if (activeTab !== 'Juz') shouldCenterRef.current.Juz = true;
  }, [selectedJuzId, activeTab]);
  useEffect(() => {
    if (activeTab !== 'Page') shouldCenterRef.current.Page = true;
  }, [selectedPageId, activeTab]);

  useLayoutEffect(() => {
    const sidebar = scrollRef.current;
    if (!sidebar) return;

    let top = 0;
    if (activeTab === 'Surah') {
      top = Number(sessionStorage.getItem('surahScrollTop')) || surahScrollTop;
    } else if (activeTab === 'Juz') {
      top = Number(sessionStorage.getItem('juzScrollTop')) || juzScrollTop;
    } else {
      top = Number(sessionStorage.getItem('pageScrollTop')) || pageScrollTop;
    }
    sidebar.scrollTop = top;

    const activeEl = sidebar.querySelector<HTMLElement>('[data-active="true"]');
    if (activeEl) {
      const sidebarRect = sidebar.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      const isOutside = activeRect.top < sidebarRect.top || activeRect.bottom > sidebarRect.bottom;

      if (shouldCenterRef.current[activeTab] && (top === 0 || isOutside)) {
        activeEl.scrollIntoView({ block: 'center' });
      }
    }
    shouldCenterRef.current[activeTab] = false;
  }, [
    activeTab,
    surahScrollTop,
    juzScrollTop,
    pageScrollTop,
    selectedSurahId,
    selectedJuzId,
    selectedPageId,
  ]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    if (activeTab === 'Surah') {
      setSurahScrollTop(top);
      sessionStorage.setItem('surahScrollTop', String(top));
    } else if (activeTab === 'Juz') {
      setJuzScrollTop(top);
      sessionStorage.setItem('juzScrollTop', String(top));
    } else {
      setPageScrollTop(top);
      sessionStorage.setItem('pageScrollTop', String(top));
    }
  };

  const prepareForTabSwitch = (nextTab: TabKey) => {
    const top = scrollRef.current?.scrollTop ?? 0;
    if (activeTab === 'Surah') setSurahScrollTop(top);
    else if (activeTab === 'Juz') setJuzScrollTop(top);
    else setPageScrollTop(top);
    shouldCenterRef.current[nextTab] = true;
  };

  const rememberScroll = (tab: TabKey) => {
    const top = scrollRef.current?.scrollTop ?? 0;
    if (tab === 'Surah') {
      setSurahScrollTop(top);
      sessionStorage.setItem('surahScrollTop', String(top));
      sessionStorage.setItem('skipCenterSurah', '1');
    } else if (tab === 'Juz') {
      setJuzScrollTop(top);
      sessionStorage.setItem('juzScrollTop', String(top));
      sessionStorage.setItem('skipCenterJuz', '1');
    } else {
      setPageScrollTop(top);
      sessionStorage.setItem('pageScrollTop', String(top));
      sessionStorage.setItem('skipCenterPage', '1');
    }
  };

  return { scrollRef, handleScroll, prepareForTabSwitch, rememberScroll };
};

export default useSidebarScroll;

export type { TabKey };
