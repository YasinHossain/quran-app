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
import type { MushafLineGroup } from '@/types';
import type React from 'react';

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
  qcfVersion: 'v1' | 'v2';
  indopakVersion?: '15' | '16' | null;
  isFontLoaded: boolean;
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
  qcfVersion: 'v1' | 'v2';
  indopakVersion?: '15' | '16' | null;
}): { fontSize: string | number; lineWidthDesktop: string } => {
  const mushafScale = fontSizeToMushafScale(settings.arabicFontSize);

  if (isQcfMushaf) {
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
    <span className="inline-flex h-8 items-center justify-center rounded-full border border-border/60 bg-surface/80 px-4 text-xs font-medium text-muted shadow-sm backdrop-blur-sm">
      <span className="tracking-widest">{`صفحة ${toArabicIndicNumber(pageNumber)}`}</span>
      <span className="mx-2 text-muted-foreground/40">•</span>
      <span>{`الجزء ${toArabicIndicNumber(juzNumber)}`}</span>
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

const toArabicIndicNumber = (num: number): string => {
  const digits = '٠١٢٣٤٥٦٧٨٩';
  return `${num}`.replace(/\d/g, (d) => digits[Number(d)] ?? d);
};

export const MushafPage = ({
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
}: MushafPageProps): React.JSX.Element => {
  const { fontSize, lineWidthDesktop } = getMushafFontConfig({
    settings,
    isQcfMushaf,
    isQpcHafsMushaf,
    isIndopakMushaf,
    qcfVersion,
    indopakVersion,
  });

  const juzNumber = getJuzByPage(pageNumber);

  return (
    <article
      aria-label={`Page ${pageNumber}`}
      className={cn(
        'mx-auto w-full py-6 sm:py-8',
        isQcfMushaf || isQpcHafsMushaf || isIndopakMushaf
          ? 'max-w-none overflow-x-auto px-8'
          : undefined
      )}
    >
      <MushafLines
        lines={lines}
        settings={settings}
        isQcfMushaf={isQcfMushaf}
        isQpcHafsMushaf={isQpcHafsMushaf}
        isIndopakMushaf={isIndopakMushaf}
        qcfVersion={qcfVersion}
        indopakVersion={indopakVersion}
        fontSize={fontSize}
        fontFamily={fontFamily}
        lineWidthDesktop={lineWidthDesktop}
        isFontLoaded={isFontLoaded}
      />
      {pageNumber ? <MushafPageFooter pageNumber={pageNumber} juzNumber={juzNumber} /> : null}
    </article>
  );
};
