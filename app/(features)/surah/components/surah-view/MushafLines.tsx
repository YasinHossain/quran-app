import { cn } from '@/lib/utils/cn';

import { MushafLine } from './MushafLine';

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
  fontSize,
  fontFamily,
  lineWidthDesktop,
  isFontLoaded,
}: MushafLinesProps): React.JSX.Element => (
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
        fontSize={fontSize}
        isFontLoaded={isFontLoaded}
      />
    ))}
  </div>
);
