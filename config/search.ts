import { parseBooleanEnv, parseNumberEnv } from './utils';

/**
 * Search configuration segment.
 *
 * Fine-tunes search behaviour within the application.
 */
export interface SearchConfig {
  enableFuzzySearch: boolean;
  maxResults: number;
  minQueryLength: number;
  highlightMatches: boolean;
}

const resolveIntInRange = (
  value: number | undefined,
  fallback: number,
  min: number,
  max: number
): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  const resolved = Math.trunc(value);
  if (resolved < min) return min;
  if (resolved > max) return max;
  return resolved;
};

const resolveIntAtLeast = (value: number | undefined, fallback: number, min: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.max(min, Math.trunc(value));
};

export const searchConfig: SearchConfig = {
  enableFuzzySearch: parseBooleanEnv('SEARCH_ENABLE_FUZZY', true),
  maxResults: resolveIntInRange(parseNumberEnv('SEARCH_MAX_RESULTS', 50), 50, 1, 1000),
  minQueryLength: resolveIntAtLeast(parseNumberEnv('SEARCH_MIN_QUERY_LENGTH', 3), 3, 1),
  highlightMatches: parseBooleanEnv('SEARCH_HIGHLIGHT_MATCHES', true),
};
