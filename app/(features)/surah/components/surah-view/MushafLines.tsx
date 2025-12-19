'use client';

import { cn } from '@/lib/utils/cn';

import { MushafLine } from './MushafLine';
import { MushafReflowContent } from './MushafReflowContent';
import { useMushafReflow } from './useMushafReflow';

import type { ReaderSettings } from './MushafMain.types';
import type { MushafLineGroup } from '@/types';
import type React from 'react';

type MushafLinesProps = {
  lines: MushafLineGroup[];
  settings: ReaderSettings;
  isQcfMushaf: boolean;
  isQpcHafsMushaf: boolean;
  isIndopakMushaf: boolean;
  qcfVersion: 'v1' | 'v2';
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
  // Detect if we need to reflow text on mobile when content would overflow
  // Uses same calculation as CSS: if lineWidthDesktop > 95vw, overflow would occur
  const isReflowMode = useMushafReflow(lineWidthDesktop);

  // In reflow mode (mobile + overflow), render all words as a single continuous flow
  if (isReflowMode) {
    return (
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
    );
  }

  // Standard straight-line layout (desktop and mobile when content fits)
  // This is the original, carefully-engineered layout - UNCHANGED
  return (
    <div
      className={cn(
        'flex flex-col',
        isQcfMushaf || isQpcHafsMushaf || isIndopakMushaf
          ? 'gap-1 sm:gap-1.5 mx-auto'
          : 'gap-4 sm:gap-5'
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
  );
};

