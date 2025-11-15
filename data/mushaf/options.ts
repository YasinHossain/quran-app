import { MushafOption } from '@/types';

export const DEFAULT_MUSHAF_ID = 'unicode-default';

export const MUSHAF_OPTIONS: MushafOption[] = [
  {
    id: DEFAULT_MUSHAF_ID,
    name: 'Unicode - Uthmani 15-line',
    description: 'Standard Madani mushaf layout rendered with Unicode text.',
    script: 'uthmani',
    lines: 15,
  },
  {
    id: 'unicode-indopak-16',
    name: 'Unicode - IndoPak 16-line',
    description: 'Popular IndoPak layout with 16 lines per page.',
    script: 'indopak',
    lines: 16,
  },
];

export const getDefaultMushafOption = (): MushafOption => MUSHAF_OPTIONS[0];

export const findMushafOption = (id?: string): MushafOption | undefined =>
  id ? MUSHAF_OPTIONS.find((option) => option.id === id) : undefined;

