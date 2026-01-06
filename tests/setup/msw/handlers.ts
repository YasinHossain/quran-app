import { mediaHandlers } from './handlers/mediaHandlers';
import { quranApiHandlers } from './handlers/quranApiHandlers';

import type { HttpHandler } from 'msw';

export const handlers: HttpHandler[] = [
  ...quranApiHandlers,
  ...mediaHandlers,
];
