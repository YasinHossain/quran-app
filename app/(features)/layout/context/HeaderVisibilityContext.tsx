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
    let pivotY = window.scrollY;

    const handleScroll = (): void => {
      const currentY = window.scrollY;
      const isScrollingDown = currentY > lastScrollY.current;

      // Reset pivot when direction changes
      if (isScrollingDown && currentY < pivotY) pivotY = currentY;
      if (!isScrollingDown && currentY > pivotY) pivotY = currentY;

      // Always show at top, otherwise apply 100px threshold
      if (currentY < 50) {
        setIsHidden(false);
        pivotY = currentY;
      } else if (Math.abs(currentY - pivotY) > 100) {
        setIsHidden(isScrollingDown);
        pivotY = currentY; // Reset pivot to prevent continuous flickering if logic differs
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
