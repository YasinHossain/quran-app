import { MushafOption } from '@/types';

export const DEFAULT_MUSHAF_ID = 'qcf-madani-v1';

export const MUSHAF_OPTIONS: MushafOption[] = [
  {
    id: 'qcf-madani-v1',
    name: 'Quran.com · King Fahad Complex V1',
    description: 'High-fidelity Uthmani glyph mushaf (per-page QCF fonts).',
    script: 'uthmani',
    lines: 15,
  },
  {
    id: 'qcf-madani-v2',
    name: 'Quran.com · King Fahad Complex V2',
    description: 'High-fidelity Uthmani glyph mushaf V2 (per-page QCF fonts).',
    script: 'uthmani',
    lines: 15,
  },
  {
    id: 'unicode-indopak-16',
    name: 'Unicode IndoPak (16-line)',
    description: 'Standard text-based IndoPak mushaf.',
    script: 'indopak',
    lines: 16,
  },
];

export const getDefaultMushafOption = (): MushafOption => MUSHAF_OPTIONS[0]!;

export const findMushafOption = (id?: string): MushafOption | undefined =>
  id ? MUSHAF_OPTIONS.find((option) => option.id === id) : undefined;
