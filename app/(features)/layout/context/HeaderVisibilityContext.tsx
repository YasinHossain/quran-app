'use client';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface HeaderVisibilityState {
  isHidden: boolean;
  setScrollContainer: (element: HTMLElement | null) => void;
}

const HeaderVisibilityContext = createContext<HeaderVisibilityState>({
  isHidden: false,
  setScrollContainer: () => {},
});

export const HeaderVisibilityProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  // Dummy setter for backward compatibility (no longer needed with window scrolling)
  const setScrollContainer = (): void => {};

  useEffect(() => {
    // Reset state on every page navigation
    lastScrollY.current = 0;
    setIsHidden(false);

    // Always use window scroll (body scrolling like Quran.com)
    const handleScroll = (): void => {
      const currentY = window.scrollY;

      // Immediate response to scroll direction
      // Hide header when scrolling down past 20px
      if (currentY > lastScrollY.current && currentY > 20) {
        setIsHidden(true);
      }
      // Show header when scrolling up
      else if (currentY < lastScrollY.current) {
        setIsHidden(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    <HeaderVisibilityContext.Provider value={{ isHidden, setScrollContainer }}>
      {children}
    </HeaderVisibilityContext.Provider>
  );
};

export const useHeaderVisibility = (): HeaderVisibilityState => useContext(HeaderVisibilityContext);
