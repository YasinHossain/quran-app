import React, { memo } from 'react';

import {
  fontSizeToMushafScale,
  mushafScaleToFontSize,
} from '@/app/(features)/surah/hooks/mushafFontScale';
import {
  getIndopak15Preset,
  getIndopak16Preset,
  getQcfV1Preset,
  getQcfV2Preset,
  getQpcHafsPreset,
} from '@/app/(features)/surah/hooks/qcfScalePresets';
import { cn } from '@/lib/utils/cn';
import { getJuzByPage } from '@/lib/utils/surah-navigation';

import { MushafLines } from './MushafLines';

import type { ReaderSettings } from './MushafMain.types';
import type { QcfFontVersion } from '@/app/(features)/surah/hooks/useQcfMushafFont';
import type { MushafLineGroup } from '@/types';

const MIN_LINE_WIDTH_PX = 440;
const MAX_LINE_WIDTH_PX = 540;
const LINE_WIDTH_SCALE = 16;

interface MushafPageProps {
  pageNumber: number;
  lines: MushafLineGroup[];
  settings: ReaderSettings;
  fontFamily: string;
  isQcfMushaf: boolean;
  isQpcHafsMushaf: boolean;
  isIndopakMushaf: boolean;
  qcfVersion: QcfFontVersion;
  indopakVersion?: '15' | '16' | null;
  isFontLoaded: boolean;
  className?: string;
  minHeight?: number;
  isMobile?: boolean;
}

const getMushafFontConfig = ({
  settings,
  isQcfMushaf,
  isQpcHafsMushaf,
  isIndopakMushaf,
  qcfVersion,
  indopakVersion,
}: {
  settings: ReaderSettings;
  isQcfMushaf: boolean;
  isQpcHafsMushaf: boolean;
  isIndopakMushaf: boolean;
  qcfVersion: QcfFontVersion;
  indopakVersion?: '15' | '16' | null;
}): { fontSize: string | number; lineWidthDesktop: string } => {
  const mushafScale = fontSizeToMushafScale(settings.arabicFontSize);

  if (isQcfMushaf) {
    // V4 (Tajweed) uses the same sizing as V1
    const preset = qcfVersion === 'v2' ? getQcfV2Preset(mushafScale) : getQcfV1Preset(mushafScale);
    return {
      fontSize: preset.fontSize,
      lineWidthDesktop: preset.lineWidthDesktop,
    };
  }

  if (isQpcHafsMushaf || isIndopakMushaf) {
    let preset;
    if (isIndopakMushaf) {
      preset =
        indopakVersion === '16' ? getIndopak16Preset(mushafScale) : getIndopak15Preset(mushafScale);
    } else {
      preset = getQpcHafsPreset(mushafScale);
    }
    return {
      fontSize: preset.fontSize,
      lineWidthDesktop: preset.lineWidthDesktop,
    };
  }

  const fontSize = mushafScaleToFontSize(mushafScale);
  return {
    fontSize,
    lineWidthDesktop: `${getLineWidth(fontSize)}px`,
  };
};

const MushafPageFooter = ({
  pageNumber,
  juzNumber,
}: {
  pageNumber: number;
  juzNumber: number;
}): React.JSX.Element => (
  <div className="mt-6 flex justify-center sm:mt-8">
    <span className="inline-flex items-center justify-center rounded-xl bg-surface px-6 py-2 text-xs font-medium text-muted shadow-sm">
      <span className="tracking-widest">{`Page ${pageNumber}`}</span>
      <span className="mx-2 text-muted-foreground/40">•</span>
      <span>{`Juz ${juzNumber}`}</span>
    </span>
  </div>
);

const getLineWidth = (fontSize: number): number => {
  const scaled = fontSize * LINE_WIDTH_SCALE;
  const clamped = Math.max(MIN_LINE_WIDTH_PX, Math.min(MAX_LINE_WIDTH_PX, scaled));

  if (typeof window === 'undefined') {
    return clamped;
  }

  const maxViewportWidth = Math.floor(window.innerWidth * 0.9);
  return Math.min(clamped, maxViewportWidth);
};

export const MushafPage = memo(function MushafPage({
  pageNumber,
  lines,
  settings,
  fontFamily,
  isQcfMushaf,
  isQpcHafsMushaf,
  isIndopakMushaf,
  qcfVersion,
  indopakVersion,
  isFontLoaded,
  className,
  minHeight = 600,
  isMobile = false,
}: MushafPageProps): React.JSX.Element {
  const { fontSize, lineWidthDesktop } = getMushafFontConfig({
    settings,
    isQcfMushaf,
    isQpcHafsMushaf,
    isIndopakMushaf,
    qcfVersion,
    ...(indopakVersion !== undefined ? { indopakVersion } : {}),
  });

  const juzNumber = getJuzByPage(pageNumber);

  return (
    <article
      aria-label={`Page ${pageNumber}`}
      className={cn(
        'mx-auto w-full py-6 sm:py-8',
        isQcfMushaf || isQpcHafsMushaf || isIndopakMushaf
          ? 'max-w-none overflow-x-auto px-8'
          : undefined,
        className
      )}
      style={{
        // CSS containment for improved scroll performance
        contain: 'layout style paint',
        // Let content determine natural height - don't enforce minHeight
        // Virtuoso will measure the actual height after render for accurate scrolling
      }}
    >
      <MushafLines
        lines={lines}
        settings={settings}
        isQcfMushaf={isQcfMushaf}
        isQpcHafsMushaf={isQpcHafsMushaf}
        isIndopakMushaf={isIndopakMushaf}
        qcfVersion={qcfVersion}
        {...(indopakVersion !== undefined ? { indopakVersion } : {})}
        fontSize={fontSize}
        // Force reflow on mobile to prevent layout shift during mount
        forceReflow={isMobile}
        fontFamily={fontFamily}
        lineWidthDesktop={lineWidthDesktop}
        isFontLoaded={isFontLoaded}
      />
      {pageNumber ? <MushafPageFooter pageNumber={pageNumber} juzNumber={juzNumber} /> : null}
    </article>
  );
});
