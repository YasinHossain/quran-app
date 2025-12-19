'use client';

import { useState, useEffect, useCallback } from 'react';

const MOBILE_BREAKPOINT = 1280; // xl breakpoint - when mobile nav appears

/**
 * Hook to detect when mushaf text should reflow on mobile devices.
 *
 * Reflow mode activates when:
 * 1. Screen width is below mobile breakpoint (1280px)
 * 2. The lineWidthDesktop (in vh or px) exceeds 95vw
 *
 * This matches the exact same condition that causes the horizontal slider to appear.
 */
export function useMushafReflow(lineWidthDesktop: string): boolean {
    const [isReflowMode, setIsReflowMode] = useState(false);

    const checkShouldReflow = useCallback(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const isMobile = viewportWidth < MOBILE_BREAKPOINT;

        if (!isMobile) {
            // On desktop, never use reflow mode - preserve straight-line layout
            return false;
        }

        // Parse the lineWidthDesktop value to get the actual pixel width
        // Format is typically "50vh", "103.5vh", "560px", etc.
        let lineWidthPx = 560; // default fallback

        // Check for vh units (viewport height) - this is what the presets use
        const vhMatch = lineWidthDesktop.match(/^(\d+(?:\.\d+)?)vh$/);
        if (vhMatch && vhMatch[1]) {
            const vhValue = parseFloat(vhMatch[1]);
            // Convert vh to pixels: 1vh = 1% of viewport height
            lineWidthPx = (vhValue / 100) * viewportHeight;
        } else {
            // Check for px units
            const pxMatch = lineWidthDesktop.match(/^(\d+(?:\.\d+)?)px$/);
            if (pxMatch && pxMatch[1]) {
                lineWidthPx = parseFloat(pxMatch[1]);
            }
        }

        // The container uses width: min(var(--mushaf-line-width), 95vw)
        // Overflow happens when lineWidthDesktop > 95% of viewport width
        const maxContainerWidth = viewportWidth * 0.95;

        // If line width exceeds 95vw, the slider would appear - switch to reflow
        return lineWidthPx > maxContainerWidth;
    }, [lineWidthDesktop]);

    useEffect(() => {
        // Initial check
        setIsReflowMode(checkShouldReflow());

        // Listen for resize events
        const handleResize = () => {
            setIsReflowMode(checkShouldReflow());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [checkShouldReflow]);

    return isReflowMode;
}



