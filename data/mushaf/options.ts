import { MushafOption } from '@/types';

export const DEFAULT_MUSHAF_ID = 'qcf-madani-v1';
export const TAJWEED_MUSHAF_ID = 'qcf-tajweed-v4';

export const MUSHAF_OPTIONS: MushafOption[] = [
  {
    id: 'qcf-madani-v1',
    name: 'King Fahad Complex V1',
    description: 'High-fidelity Uthmani glyph mushaf (per-page QCF fonts).',
    script: 'uthmani',
    lines: 15,
  },
  {
    id: 'qcf-madani-v2',
    name: 'King Fahad Complex V2',
    description: 'High-fidelity Uthmani glyph mushaf V2 (per-page QCF fonts).',
    script: 'uthmani',
    lines: 15,
  },
  {
    id: 'qpc-uthmani-hafs',
    name: 'QPC Uthmani Hafs',
    description: 'High-fidelity Uthmani Hafs font (text-based).',
    script: 'uthmani',
    lines: 15,
  },
  {
    id: 'unicode-indopak-15',
    name: 'IndoPak (15-line)',
    description: 'IndoPak Nastaleeq layout with 15 lines per page.',
    script: 'indopak',
    lines: 15,
  },
  {
    id: 'unicode-indopak-16',
    name: 'IndoPak (16-line)',
    description: 'Standard IndoPak Nastaleeq layout (16 lines per page).',
    script: 'indopak',
    lines: 16,
  },
  {
    id: 'qcf-tajweed-v4',
    name: 'Tajweed Colors',
    description: 'King Fahad Complex V4 with Tajweed color-coded glyphs.',
    script: 'tajweed',
    lines: 15,
  },
];

export const getDefaultMushafOption = (): MushafOption => MUSHAF_OPTIONS[0]!;

export const findMushafOption = (id?: string): MushafOption | undefined =>
  id ? MUSHAF_OPTIONS.find((option) => option.id === id) : undefined;
