export interface QcfScalePreset {
  fontSizePx: number;
  lineWidthDesktop: string;
}

const clampScale = (scale: number): number => {
  const s = Math.round(scale);
  if (s < 1) return 1;
  if (s > 10) return 10;
  return s;
};

/**
 * Approximated Quran.com QCF Madani V1 presets so the glyph layout mirrors
 * the King Fahad Complex Mushaf as closely as possible.
 */
const QCF_V1_PRESETS: Record<number, QcfScalePreset> = {
  // Upscaled compared to the original mapping so that higher Arabic font
  // sizes fill more of the center column (especially in King Fahad / QCF
  // mode) while preserving the relative zoom steps.
  1: { fontSizePx: 31, lineWidthDesktop: '60vh' },
  2: { fontSizePx: 34, lineWidthDesktop: '65vh' },
  3: { fontSizePx: 37, lineWidthDesktop: '73.5vh' },
  4: { fontSizePx: 41, lineWidthDesktop: '74vh' },
  5: { fontSizePx: 44, lineWidthDesktop: '81vh' },
  6: { fontSizePx: 48, lineWidthDesktop: '102.8vh' },
  7: { fontSizePx: 53, lineWidthDesktop: '124.6vh' },
  8: { fontSizePx: 57, lineWidthDesktop: '146.4vh' },
  9: { fontSizePx: 62, lineWidthDesktop: '168.2vh' },
  10: { fontSizePx: 66, lineWidthDesktop: '190vh' },
};

export const getQcfV1Preset = (scale: number): QcfScalePreset => {
  const key = clampScale(scale);
  return (QCF_V1_PRESETS[key] ?? QCF_V1_PRESETS[1])!;
};

/**
 * Approximated Quran.com King Fahad Complex V2 presets.
 * Based on code_v2 scales from quran-com-frontend-next.
 */
const QCF_V2_PRESETS: Record<number, QcfScalePreset> = {
  1: { fontSizePx: 28, lineWidthDesktop: '52vh' },
  2: { fontSizePx: 31, lineWidthDesktop: '54vh' },
  3: { fontSizePx: 34, lineWidthDesktop: '56vh' },
  4: { fontSizePx: 37, lineWidthDesktop: '61vh' },
  5: { fontSizePx: 40, lineWidthDesktop: '64.5vh' },
  6: { fontSizePx: 44, lineWidthDesktop: '90.4vh' },
  7: { fontSizePx: 48, lineWidthDesktop: '116.3vh' },
  8: { fontSizePx: 52, lineWidthDesktop: '142.2vh' },
  9: { fontSizePx: 56, lineWidthDesktop: '168.1vh' },
  10: { fontSizePx: 60, lineWidthDesktop: '194vh' },
};

export const getQcfV2Preset = (scale: number): QcfScalePreset => {
  const key = clampScale(scale);
  return (QCF_V2_PRESETS[key] ?? QCF_V2_PRESETS[1])!;
};

/**
 * Approximated Quran.com QPC Uthmani Hafs presets.
 * Based on qpc_uthmani_hafs scales from quran-com-frontend-next.
 */
const QPC_HAFS_PRESETS: Record<number, QcfScalePreset> = {
  1: { fontSizePx: 32, lineWidthDesktop: '60vh' },
  2: { fontSizePx: 35, lineWidthDesktop: '65vh' },
  3: { fontSizePx: 39, lineWidthDesktop: '73.5vh' },
  4: { fontSizePx: 42, lineWidthDesktop: '74vh' },
  5: { fontSizePx: 46, lineWidthDesktop: '81vh' },
  6: { fontSizePx: 50, lineWidthDesktop: '102.8vh' },
  7: { fontSizePx: 55, lineWidthDesktop: '124.6vh' },
  8: { fontSizePx: 60, lineWidthDesktop: '146.4vh' },
  9: { fontSizePx: 64, lineWidthDesktop: '168.2vh' },
  10: { fontSizePx: 69, lineWidthDesktop: '190vh' },
};

export const getQpcHafsPreset = (scale: number): QcfScalePreset => {
  const key = clampScale(scale);
  return (QPC_HAFS_PRESETS[key] ?? QPC_HAFS_PRESETS[1])!;
};
