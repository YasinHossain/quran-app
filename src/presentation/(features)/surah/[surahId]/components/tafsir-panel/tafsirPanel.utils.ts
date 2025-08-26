import { TafsirResource } from '@/types';

export interface Tafsir extends TafsirResource {
  selected: boolean;
}

export const MAX_SELECTIONS = 3;

export const capitalizeLanguageName = (lang: string): string => {
  return lang
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
