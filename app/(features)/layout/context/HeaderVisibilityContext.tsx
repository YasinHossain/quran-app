'use client';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface HeaderVisibilityState {
  isHidden: boolean;
  setScrollContainer: (element: HTMLElement | null) => void;
}

const HeaderVisibilityContext = createContext<HeaderVisibilityState>({
  isHidden: false,
  setScrollContainer: () => { },
});

/**
 * Detects if the device is a touch-primary mobile device.
 * This matches the CSS media query: @media (pointer: coarse) and (max-width: 767px)
 * Used to determine scroll behavior - touch mobiles use body scrolling.
 */
const checkIsTouchMobile = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Match CSS media query: (pointer: coarse) and (max-width: 767px)
  return window.matchMedia('(pointer: coarse) and (max-width: 767px)').matches;
};

export const HeaderVisibilityProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  const [isHidden, setIsHidden] = useState(false);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);
  const [isTouchMobile, setIsTouchMobile] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  // Detect touch mobile on mount and resize
  useEffect(() => {
    const handleResize = (): void => {
      setIsTouchMobile(checkIsTouchMobile());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Reset state on every page navigation
    lastScrollY.current = 0;
    setIsHidden(false);

    // On touch mobile, we listen to window scroll (body scrolling)
    if (isTouchMobile) {
      const handleWindowScroll = (): void => {
        const currentY = window.scrollY || window.pageYOffset;
        const scrollDelta = Math.abs(currentY - lastScrollY.current);

        if (scrollDelta > 5) {
          // Hide header when scrolling down past threshold
          if (currentY > lastScrollY.current && currentY > 50) {
            setIsHidden(true);
          } else if (currentY < lastScrollY.current) {
            setIsHidden(false);
          }
        }

        lastScrollY.current = currentY;
      };

      window.addEventListener('scroll', handleWindowScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleWindowScroll);
    }

    // Desktop: Use container-based scrolling (original behavior)
    let scrollEl = scrollContainer;

    if (!scrollEl) {
      // Try to find the scrollable container based on the current page
      scrollEl = document.querySelector('.homepage-scrollable-area');

      // If not found, try to find the surah page scrollable container
      if (!scrollEl) {
        scrollEl = document.querySelector('main .overflow-y-auto');
      }

      // If still not found, try the main content area
      if (!scrollEl) {
        scrollEl = document.querySelector('main[class*="overflow-y-auto"]');
      }
    }

    if (!scrollEl) return;

    const handleScroll = (): void => {
      const currentY = (scrollEl as HTMLElement).scrollTop;
      const scrollHeight = (scrollEl as HTMLElement).scrollHeight;
      const clientHeight = (scrollEl as HTMLElement).clientHeight;
      const maxScrollableHeight = scrollHeight - clientHeight;

      // Calculate scroll delta to prevent rapid toggling
      const scrollDelta = Math.abs(currentY - lastScrollY.current);

      // For short content, require larger scroll delta to prevent shaking
      const minScrollDelta = maxScrollableHeight < 150 ? 20 : 5;

      if (scrollDelta > minScrollDelta) {
        // Hide header when scrolling down past threshold
        if (currentY > lastScrollY.current && currentY > 50) {
          setIsHidden(true);
        } else if (currentY < lastScrollY.current) {
          setIsHidden(false);
        }
      }

      lastScrollY.current = currentY;
    };

    scrollEl.addEventListener('scroll', handleScroll);

    // Cleanup by removing the event listener
    return () => scrollEl.removeEventListener('scroll', handleScroll);
  }, [pathname, scrollContainer, isTouchMobile]);

  return (
    <HeaderVisibilityContext.Provider value={{ isHidden, setScrollContainer }}>
      {children}
    </HeaderVisibilityContext.Provider>
  );
};

export const useHeaderVisibility = (): HeaderVisibilityState => useContext(HeaderVisibilityContext);

