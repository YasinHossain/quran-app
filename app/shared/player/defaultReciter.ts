import type { Reciter } from '@/app/shared/player/types';

// Default reciter to use while loading or if API fails. A plain module (no hooks) so server
// components can read it too.
export const DEFAULT_RECITER: Reciter = {
  id: 173,
  name: 'Mishari Rashid al-`Afasy',
  locale: 'Murattal',
};
