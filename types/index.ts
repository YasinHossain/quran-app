export * from './verse';
export * from './chapter';
export * from './translation';
export * from './settings';

export interface Juz {
  id: number;
  juz_number: number;
  // Add any other properties of a Juz that your API provides
  // For example: name_arabic, name_english, start_verse, end_verse, etc.
}
