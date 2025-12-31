import { useMemo } from 'react';

import type { QcfFontVersion } from '@/app/(features)/surah/hooks/useQcfMushafFont';

type TajweedFontPalettesProps = {
  pageNumbers: number[];
  version: QcfFontVersion;
};

const buildPaletteCss = (pageNumbers: number[], version: QcfFontVersion): string => {
  if (version !== 'v4') return '';
  const uniquePages = Array.from(new Set(pageNumbers)).filter(
    (page) => Number.isFinite(page) && page > 0
  );
  if (uniquePages.length === 0) return '';

  return uniquePages
    .map((pageNumber) => {
      const fontFamily = `p${pageNumber}-${version}`;
      return `@font-palette-values --tajweed-light {\n  font-family: '${fontFamily}';\n  base-palette: 0;\n}\n\n@font-palette-values --tajweed-dark {\n  font-family: '${fontFamily}';\n  base-palette: 1;\n}\n\n@font-palette-values --tajweed-sepia {\n  font-family: '${fontFamily}';\n  base-palette: 2;\n}\n`;
    })
    .join('\n');
};

export const TajweedFontPalettes = ({
  pageNumbers,
  version,
}: TajweedFontPalettesProps): React.JSX.Element | null => {
  const paletteCss = useMemo(() => buildPaletteCss(pageNumbers, version), [pageNumbers, version]);

  if (!paletteCss) return null;

  return <style dangerouslySetInnerHTML={{ __html: paletteCss }} />;
};
