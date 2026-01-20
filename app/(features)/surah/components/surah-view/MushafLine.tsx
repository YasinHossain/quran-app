import React, { memo } from 'react';

import { cn } from '@/lib/utils/cn';

import { MushafWordText } from './MushafWordText';

import type { ReaderSettings } from './MushafMain.types';
import type { QcfFontVersion } from '@/app/(features)/surah/hooks/useQcfMushafFont';
import type { MushafLineGroup } from '@/types';

type MushafLineProps = {
  line: MushafLineGroup;
  settings: ReaderSettings;
  isQcfMushaf: boolean;
  isQpcHafsMushaf: boolean;
  isIndopakMushaf: boolean;
  qcfVersion: QcfFontVersion;
  indopakVersion?: '15' | '16' | null | undefined;
  fontSize: string | number;
  isFontLoaded: boolean;
};

const getLineWrapperStyle = (fontSize: string | number): React.CSSProperties => ({
  fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
  maxWidth: 'var(--mushaf-line-width, 560px)',
  width: '100%',
});

const getLineClassName = (
  isQcfMushaf: boolean,
  qcfVersion: QcfFontVersion,
  isQpcHafsMushaf: boolean,
  isIndopakMushaf: boolean
): string =>
  cn(
    (isQcfMushaf && qcfVersion === 'v1') || isQpcHafsMushaf || isIndopakMushaf
      ? 'leading-[1.6]'
      : isQcfMushaf
        ? 'leading-[1.8]'
        : 'leading-[2.35]',
    'flex justify-between items-center'
  );

const getLineContentStyle = (isQcfMushaf: boolean): React.CSSProperties =>
  isQcfMushaf
    ? ({
        whiteSpace: 'nowrap',
        columnGap: '0',
        // CSS containment for improved scroll performance
        contain: 'layout style',
      } as React.CSSProperties)
    : ({
        whiteSpace: 'nowrap',
        // CSS containment for improved scroll performance
        contain: 'layout style',
      } as React.CSSProperties);

export const MushafLine = memo(function MushafLine({
  line,
  settings,
  isQcfMushaf,
  isQpcHafsMushaf,
  isIndopakMushaf,
  qcfVersion,
  indopakVersion,
  fontSize,
  isFontLoaded,
}: MushafLineProps): React.JSX.Element {
  return (
    <div dir="rtl" className="mx-auto text-center" style={getLineWrapperStyle(fontSize)}>
      <div
        className={getLineClassName(isQcfMushaf, qcfVersion, isQpcHafsMushaf, isIndopakMushaf)}
        style={getLineContentStyle(isQcfMushaf)}
        translate="no"
      >
        <MushafLineWords
          line={line}
          settings={settings}
          isQcfMushaf={isQcfMushaf}
          isQpcHafsMushaf={isQpcHafsMushaf}
          isIndopakMushaf={isIndopakMushaf}
          qcfVersion={qcfVersion}
          indopakVersion={indopakVersion}
          isFontLoaded={isFontLoaded}
        />
      </div>
    </div>
  );
});

const MushafLineWords = memo(function MushafLineWords({
  line,
  settings,
  isQcfMushaf,
  isQpcHafsMushaf,
  isIndopakMushaf,
  qcfVersion,
  isFontLoaded,
}: {
  line: MushafLineGroup;
  settings: ReaderSettings;
  isQcfMushaf: boolean;
  isQpcHafsMushaf: boolean;
  isIndopakMushaf: boolean;
  qcfVersion: QcfFontVersion;
  indopakVersion?: '15' | '16' | null | undefined;
  isFontLoaded: boolean;
}): React.JSX.Element {
  return (
    <>
      {line.words.map((word, index) => (
        <MushafWordText
          key={word.id ?? `${line.key}-${word.verseKey ?? 'word'}-${word.position}-${index}`}
          word={word}
          settings={settings}
          isQcfMushaf={isQcfMushaf}
          isQpcHafsMushaf={isQpcHafsMushaf}
          isIndopakMushaf={isIndopakMushaf}
          qcfVersion={qcfVersion}
          isFontLoaded={isFontLoaded}
        />
      ))}
    </>
  );
});
