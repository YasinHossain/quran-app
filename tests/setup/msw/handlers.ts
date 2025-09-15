import { qdcHandlers } from './qdcHandlers';
import { quranHandlers } from './quranHandlers';
import { staticHandlers } from './staticHandlers';

export const handlers = [...qdcHandlers, ...quranHandlers, ...staticHandlers];
