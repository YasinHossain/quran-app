'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface HeaderVisibilityState {
  isHidden: boolean;
}

const HeaderVisibilityContext = createContext<HeaderVisibilityState>({ isHidden: false });

export const HeaderVisibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    // Reset state on every page navigation
    lastScrollY.current = 0;
    setIsHidden(false);

    const scrollEl = document.querySelector('.homepage-scrollable-area');
    if (!scrollEl) return;

    const handleScroll = () => {
      const currentY = (scrollEl as HTMLElement).scrollTop;
      const scrollHeight = (scrollEl as HTMLElement).scrollHeight;
      const clientHeight = (scrollEl as HTMLElement).clientHeight;
      const maxScrollableHeight = scrollHeight - clientHeight;
      
      // Calculate scroll delta to prevent rapid toggling
      const scrollDelta = Math.abs(currentY - lastScrollY.current);
      
      // For short content, require larger scroll delta to prevent shaking
      const minScrollDelta = maxScrollableHeight < 150 ? 20 : 5;
      
      // Debug logs (remove after testing)
      console.log({
        currentY,
        lastScrollY: lastScrollY.current,
        maxScrollableHeight,
        scrollDelta,
        minScrollDelta,
        scrollingDown: currentY > lastScrollY.current
      });
      
      if (scrollDelta > minScrollDelta) {
        // Hide header when scrolling down past threshold
        if (currentY > lastScrollY.current && currentY > 50) {
          console.log('Setting header hidden to true');
          setIsHidden(true);
        } else if (currentY < lastScrollY.current) {
          console.log('Setting header hidden to false');
          setIsHidden(false);
        }
      }
      
      lastScrollY.current = currentY;
    };

    scrollEl.addEventListener('scroll', handleScroll);

    // Cleanup by removing the event listener
    return () => scrollEl.removeEventListener('scroll', handleScroll);
  }, [pathname]); // This effect re-runs on every route change

  return (
    <HeaderVisibilityContext.Provider value={{ isHidden }}>
      {children}
    </HeaderVisibilityContext.Provider>
  );
};

export const useHeaderVisibility = () => useContext(HeaderVisibilityContext);
