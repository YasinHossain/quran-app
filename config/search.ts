import { z } from 'zod';

import { parseBooleanEnv, parseNumberEnv } from './utils';

/**
 * Search configuration segment.
 *
 * Fine-tunes search behaviour within the application.
 */
export const searchSchema = z.object({
  enableFuzzySearch: z.boolean().default(true),
  maxResults: z.number().int().min(1).max(1000).default(50),
  minQueryLength: z.number().int().min(1).default(3),
  highlightMatches: z.boolean().default(true),
});

export type SearchConfig = z.infer<typeof searchSchema>;

export const searchConfig: SearchConfig = {
  enableFuzzySearch: parseBooleanEnv('SEARCH_ENABLE_FUZZY', true),
  maxResults: parseNumberEnv('SEARCH_MAX_RESULTS', 50)!,
  minQueryLength: parseNumberEnv('SEARCH_MIN_QUERY_LENGTH', 3)!,
  highlightMatches: parseBooleanEnv('SEARCH_HIGHLIGHT_MATCHES', true),
};
