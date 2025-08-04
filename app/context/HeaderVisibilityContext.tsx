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
    const scrollEl = document.querySelector('.homepage-scrollable-area');
    if (!scrollEl) return;

    const handleScroll = () => {
      const currentY = (scrollEl as HTMLElement).scrollTop;
      if (currentY > lastScrollY.current && currentY > 50) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollY.current = currentY;
    };

    scrollEl.addEventListener('scroll', handleScroll);
    // Reset scroll tracking and ensure header is visible on navigation
    lastScrollY.current = 0;
    setIsHidden(false);

    return () => scrollEl.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    <HeaderVisibilityContext.Provider value={{ isHidden }}>
      {children}
    </HeaderVisibilityContext.Provider>
  );
};

export const useHeaderVisibility = () => useContext(HeaderVisibilityContext);
