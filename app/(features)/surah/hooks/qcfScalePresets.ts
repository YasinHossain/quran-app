export interface QcfScalePreset {
  fontSize: string | number;
  lineWidthDesktop: string;
}

const clampScale = (scale: number): number => {
  const s = Math.round(scale);
  if (s < 1) return 1;
  if (s > 10) return 10;
  return s;
};

/**
 * Approximated QCF Madani V1 presets so the glyph layout mirrors
 * the King Fahad Complex Mushaf as closely as possible.
 */
const QCF_V1_PRESETS: Record<number, QcfScalePreset> = {
  // Upscaled compared to the original mapping so that higher Arabic font
  // sizes fill more of the center column (especially in King Fahad / QCF
  // mode) while preserving the relative zoom steps.
  1: { fontSize: '3.2vh', lineWidthDesktop: '50vh' },
  2: { fontSize: '3.5vh', lineWidthDesktop: '54vh' },
  3: { fontSize: '4vh', lineWidthDesktop: '61vh' },
  4: { fontSize: '4vh', lineWidthDesktop: '61.5vh' },
  5: { fontSize: '4.4vh', lineWidthDesktop: '67.5vh' },
  6: { fontSize: '5.56vh', lineWidthDesktop: '85.5vh' },
  7: { fontSize: '6.72vh', lineWidthDesktop: '103.5vh' },
  8: { fontSize: '7.88vh', lineWidthDesktop: '122vh' },
  9: { fontSize: '9.04vh', lineWidthDesktop: '139.5vh' },
  10: { fontSize: '10.27vh', lineWidthDesktop: '158vh' },
};

export const getQcfV1Preset = (scale: number): QcfScalePreset => {
  const key = clampScale(scale);
  return (QCF_V1_PRESETS[key] ?? QCF_V1_PRESETS[1])!;
};

/**
 * Approximated King Fahad Complex V2 presets.
 * Based on code_v2 scales from quran-com-frontend-next.
 */
const QCF_V2_PRESETS: Record<number, QcfScalePreset> = {
  1: { fontSize: '2.8vh', lineWidthDesktop: '47vh' },
  2: { fontSize: '2.9vh', lineWidthDesktop: '49vh' },
  3: { fontSize: '3.0vh', lineWidthDesktop: '50.5vh' },
  4: { fontSize: '3.3vh', lineWidthDesktop: '55vh' },
  5: { fontSize: '3.5vh', lineWidthDesktop: '58vh' },
  6: { fontSize: '4.9vh', lineWidthDesktop: '81.5vh' },
  7: { fontSize: '6.3vh', lineWidthDesktop: '105vh' },
  8: { fontSize: '7.7vh', lineWidthDesktop: '128vh' },
  9: { fontSize: '9.1vh', lineWidthDesktop: '151.5vh' },
  10: { fontSize: '10.5vh', lineWidthDesktop: '175vh' },
};

export const getQcfV2Preset = (scale: number): QcfScalePreset => {
  const key = clampScale(scale);
  return (QCF_V2_PRESETS[key] ?? QCF_V2_PRESETS[1])!;
};

/**
 * Approximated QPC Uthmani Hafs presets.
 * Based on qpc_uthmani_hafs scales from quran-com-frontend-next.
 */
const QPC_HAFS_PRESETS: Record<number, QcfScalePreset> = {
  1: { fontSize: '3.2vh', lineWidthDesktop: '60vh' },
  2: { fontSize: '3.5vh', lineWidthDesktop: '65vh' },
  3: { fontSize: '4vh', lineWidthDesktop: '73.5vh' },
  4: { fontSize: '4vh', lineWidthDesktop: '74vh' },
  5: { fontSize: '4.4vh', lineWidthDesktop: '81vh' },
  6: { fontSize: '5.56vh', lineWidthDesktop: '102.8vh' },
  7: { fontSize: '6.72vh', lineWidthDesktop: '124.6vh' },
  8: { fontSize: '7.88vh', lineWidthDesktop: '146.4vh' },
  9: { fontSize: '9.04vh', lineWidthDesktop: '168.2vh' },
  10: { fontSize: '10.27vh', lineWidthDesktop: '190vh' },
};

export const getQpcHafsPreset = (scale: number): QcfScalePreset => {
  const key = clampScale(scale);
  return (QPC_HAFS_PRESETS[key] ?? QPC_HAFS_PRESETS[1])!;
};

/**
 * Approximated IndoPak 15 Lines presets.
 * Based on text_indopak_15_lines scales from quran-com-frontend-next.
 * Note: Using tablet values as they seem to be the primary definition for larger screens.
 */
const INDOPAK_15_PRESETS: Record<number, QcfScalePreset> = {
  1: { fontSize: '3.2vh', lineWidthDesktop: '58vh' },
  2: { fontSize: '3.5vh', lineWidthDesktop: '64vh' },
  3: { fontSize: '4vh', lineWidthDesktop: '76vh' },
  4: { fontSize: '4.2vh', lineWidthDesktop: '75vh' },
  5: { fontSize: '4.3vh', lineWidthDesktop: '76vh' },
  6: { fontSize: '5.64vh', lineWidthDesktop: '98.6vh' },
  7: { fontSize: '6.98vh', lineWidthDesktop: '121.2vh' },
  8: { fontSize: '8.32vh', lineWidthDesktop: '143.8vh' },
  9: { fontSize: '9.66vh', lineWidthDesktop: '166.4vh' },
  10: { fontSize: '11vh', lineWidthDesktop: '189vh' },
};

export const getIndopak15Preset = (scale: number): QcfScalePreset => {
  const key = clampScale(scale);
  return (INDOPAK_15_PRESETS[key] ?? INDOPAK_15_PRESETS[1])!;
};

/**
 * Approximated IndoPak 16 Lines presets.
 * Adjusted to be slightly narrower than 15 lines to ensure proper justification.
 */
const INDOPAK_16_PRESETS: Record<number, QcfScalePreset> = {
  1: { fontSize: '3.2vh', lineWidthDesktop: '52vh' },
  2: { fontSize: '3.5vh', lineWidthDesktop: '58vh' },
  3: { fontSize: '4vh', lineWidthDesktop: '68vh' },
  4: { fontSize: '4.2vh', lineWidthDesktop: '68vh' },
  5: { fontSize: '4.3vh', lineWidthDesktop: '69vh' },
  6: { fontSize: '5.64vh', lineWidthDesktop: '89vh' },
  7: { fontSize: '6.98vh', lineWidthDesktop: '109vh' },
  8: { fontSize: '8.32vh', lineWidthDesktop: '129vh' },
  9: { fontSize: '9.66vh', lineWidthDesktop: '150vh' },
  10: { fontSize: '11vh', lineWidthDesktop: '170vh' },
};

export const getIndopak16Preset = (scale: number): QcfScalePreset => {
  const key = clampScale(scale);
  return (INDOPAK_16_PRESETS[key] ?? INDOPAK_16_PRESETS[1])!;
};
