import { mediaHandlers } from './handlers/mediaHandlers';
import { qdcHandlers } from './handlers/qdcHandlers';
import { quranApiHandlers } from './handlers/quranApiHandlers';

import type { HttpHandler } from 'msw';

export const handlers: HttpHandler[] = [...qdcHandlers, ...quranApiHandlers, ...mediaHandlers];
