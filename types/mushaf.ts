export interface MushafOption {
  id: string;
  name: string;
  description?: string;
  script?: 'uthmani' | 'indopak' | 'tajweed' | string;
  lines?: number;
}

