'use client';

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
  const handleCopy = (event: React.ClipboardEvent<HTMLDivElement>): void => {
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
      .map((node) => node.dataset.copyText?.trim())
      .filter((text): text is string => Boolean(text));
    const normalized = selectedWords.length
      ? selectedWords.join(' ')
      : selection.toString().replace(/\s+/g, ' ').trim();
    if (!normalized) return;
    event.preventDefault();
    event.clipboardData.setData('text/plain', normalized);
  };

  // Calculate the media query for when to switch to reflow mode
  // This replaces the JS-based useMushafReflow hook to prevent layout shifts/jumps
  const getReflowMediaQuery = (): string => {
    // 1. Mobile constraint (must be < 1280px)
    const mobileQuery = '(max-width: 1279px)';

    // 2. Overflow constraint (lineWidth > 95vw)
    // Means: viewportWidth < lineWidth / 0.95
    let overflowQuery = '';

    const vhMatch = lineWidthDesktop.match(/^(\d+(?:\.\d+)?)vh$/);
    const pxMatch = lineWidthDesktop.match(/^(\d+(?:\.\d+)?)px$/);

    if (vhMatch?.[1]) {
      // vh unit: width < (vh/100 * height) / 0.95
      // width/height < vh / 95
      const ratio = parseFloat(vhMatch[1]) / 95;
      overflowQuery = `(max-aspect-ratio: ${ratio})`;
    } else {
      let px = 560;
      if (pxMatch?.[1]) {
        px = parseFloat(pxMatch[1]);
      }
      // px unit: width < px / 0.95
      const pxLimit = px / 0.95;
      overflowQuery = `(max-width: ${pxLimit}px)`;
    }

    return `@media ${mobileQuery} and ${overflowQuery}`;
  };

  const scopeId = `mushaf-layout-${lineWidthDesktop.replace(/[^a-z0-9]/gi, '')}`;
  const mediaQuery = getReflowMediaQuery();

  // Styles to toggle visibility based on the media query
  const styleCss = `
    .${scopeId} .mushaf-reflow-view { display: none; }
    .${scopeId} .mushaf-standard-view { display: block; }
    
    ${mediaQuery} {
      .${scopeId} .mushaf-reflow-view { display: block !important; }
      .${scopeId} .mushaf-standard-view { display: none !important; }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styleCss }} />
      <div className={scopeId} onCopy={handleCopy}>
        {/* Standard Lines Layout (Desktop / Wide Mobile) */}
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

        {/* Reflow Layout (Mobile Overflow) */}
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
      </div>
    </>
  );
};
