'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils/cn';

import { MushafLine } from './MushafLine';
import { MushafReflowContent } from './MushafReflowContent';

import type { ReaderSettings } from './MushafMain.types';
import type { QcfFontVersion } from '@/app/(features)/surah/hooks/useQcfMushafFont';
import type { MushafLineGroup } from '@/types';
import type React from 'react';

type MushafLinesProps = {
  lines: MushafLineGroup[];
  settings: ReaderSettings;
  isQcfMushaf: boolean;
  isQpcHafsMushaf: boolean;
  isIndopakMushaf: boolean;
  qcfVersion: QcfFontVersion;
  indopakVersion?: '15' | '16' | null | undefined;
  fontSize: string | number;
  fontFamily: string;
  lineWidthDesktop: string;
  isFontLoaded: boolean;
};

/**
 * Parse lineWidthDesktop value to pixels.
 * Handles px and vh units.
 */
const parseLineWidthToPx = (lineWidthDesktop: string): number => {
  const pxMatch = lineWidthDesktop.match(/^(\d+(?:\.\d+)?)px$/);
  if (pxMatch?.[1]) {
    return parseFloat(pxMatch[1]);
  }

  const vhMatch = lineWidthDesktop.match(/^(\d+(?:\.\d+)?)vh$/);
  if (vhMatch?.[1] && typeof window !== 'undefined') {
    return (parseFloat(vhMatch[1]) / 100) * window.innerHeight;
  }

  return 560; // default fallback
};

/**
 * Check if reflow mode should be used based on container width and line width.
 * @param containerWidth - The actual available width of the content container
 * @param lineWidthDesktop - The desired line width (in px or vh units)
 * @returns true if reflow mode should be used (line would overflow container)
 */
const checkShouldReflow = (containerWidth: number, lineWidthDesktop: string): boolean => {
  if (containerWidth <= 0) return false;

  const lineWidthPx = parseLineWidthToPx(lineWidthDesktop);
  // Allow 5% margin - if line would take more than 95% of container, use reflow
  const maxAllowedWidth = containerWidth * 0.95;

  return lineWidthPx > maxAllowedWidth;
};

/**
 * Custom hook that detects when to use reflow mode.
 * Uses ResizeObserver to measure the actual container width (not window width).
 * This properly accounts for sidebars and other layout elements.
 */
const useReflowMode = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  lineWidthDesktop: string
): boolean => {
  const [shouldReflow, setShouldReflow] = useState(false);
  const prevLineWidthRef = useRef(lineWidthDesktop);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Function to check and update reflow state
    const checkReflow = (): void => {
      const containerWidth = container.clientWidth;
      const newShouldReflow = checkShouldReflow(containerWidth, lineWidthDesktop);
      setShouldReflow(newShouldReflow);
    };

    // Check immediately
    checkReflow();

    // Also check when lineWidthDesktop changes
    if (prevLineWidthRef.current !== lineWidthDesktop) {
      prevLineWidthRef.current = lineWidthDesktop;
      checkReflow();
    }

    // Use ResizeObserver to detect container size changes
    // This handles: window resize, sidebar open/close, layout changes
    const resizeObserver = new ResizeObserver(() => {
      checkReflow();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, lineWidthDesktop]);

  return shouldReflow;
};

export const MushafLines = ({
  lines,
  settings,
  isQcfMushaf,
  isQpcHafsMushaf,
  isIndopakMushaf,
  qcfVersion,
  indopakVersion,
  fontSize,
  fontFamily,
  lineWidthDesktop,
  isFontLoaded,
}: MushafLinesProps): React.JSX.Element => {
  // Container ref to measure actual available width
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback((event: React.ClipboardEvent<HTMLDivElement>): void => {
    if (typeof window === 'undefined') return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const container = event.currentTarget;
    const wordNodes = Array.from(
      container.querySelectorAll<HTMLElement>('[data-mushaf-word="true"]')
    );
    const selectedWords = wordNodes
      .filter((node) => {
        try {
          return range.intersectsNode(node);
        } catch {
          return false;
        }
      })
      .map((node) => node.dataset['copyText']?.trim())
      .filter((text): text is string => Boolean(text));
    const normalized = selectedWords.length
      ? selectedWords.join(' ')
      : selection.toString().replace(/\s+/g, ' ').trim();
    if (!normalized) return;
    event.preventDefault();
    event.clipboardData.setData('text/plain', normalized);
  }, []);

  // Detect reflow mode based on actual container width AND font size (lineWidthDesktop)
  const shouldUseReflow = useReflowMode(containerRef, lineWidthDesktop);

  const scopeId = useMemo(
    () => `mushaf-layout-${lineWidthDesktop.replace(/[^a-z0-9]/gi, '')}`,
    [lineWidthDesktop]
  );

  return (
    <div
      ref={containerRef}
      className={scopeId}
      onCopy={handleCopy}
      style={{
        // Constrain width to parent's available space for proper measurement
        width: '100%',
        // Prevent content from expanding container - forces reflow mode instead
        overflow: 'hidden',
      }}
    >
      {shouldUseReflow ? (
        // Reflow Layout (Mobile/Overflow mode)
        <div
          className={cn(
            'mushaf-reflow-view',
            isQcfMushaf && qcfVersion === 'v4' && 'tajweed-palette'
          )}
        >
          <MushafReflowContent
            lines={lines}
            settings={settings}
            isQcfMushaf={isQcfMushaf}
            isQpcHafsMushaf={isQpcHafsMushaf}
            isIndopakMushaf={isIndopakMushaf}
            qcfVersion={qcfVersion}
            indopakVersion={indopakVersion}
            fontSize={fontSize}
            fontFamily={fontFamily}
            isFontLoaded={isFontLoaded}
          />
        </div>
      ) : (
        // Standard Lines Layout (Desktop / Wide view)
        <div
          className={cn(
            'mushaf-standard-view flex flex-col',
            isQcfMushaf || isQpcHafsMushaf || isIndopakMushaf
              ? 'gap-1 sm:gap-1.5 mx-auto'
              : 'gap-4 sm:gap-5',
            isQcfMushaf && qcfVersion === 'v4' && 'tajweed-palette'
          )}
          style={
            {
              '--mushaf-line-width': lineWidthDesktop,
              fontFamily,
              width:
                isQcfMushaf || isQpcHafsMushaf || isIndopakMushaf
                  ? 'min(var(--mushaf-line-width), 95vw)'
                  : 'auto',
              // CSS containment for improved scroll performance
              contain: 'layout style',
            } as React.CSSProperties
          }
        >
          {lines.map((line) => (
            <MushafLine
              key={line.key}
              line={line}
              settings={settings}
              isQcfMushaf={isQcfMushaf}
              isQpcHafsMushaf={isQpcHafsMushaf}
              isIndopakMushaf={isIndopakMushaf}
              qcfVersion={qcfVersion}
              indopakVersion={indopakVersion}
              fontSize={fontSize}
              isFontLoaded={isFontLoaded}
            />
          ))}
        </div>
      )}
    </div>
  );
};
