/**
 * Configuration utility helpers.
 *
 * Provides functions for accessing and parsing environment variables in a
 * type-safe manner. These helpers avoid repeating boilerplate in individual
 * configuration modules.
 */
export function getEnvVar(key: string, fallback?: string): string | undefined {
  const value = process.env[key];
  return value ?? fallback;
}

/**
 * Parse an environment variable into a boolean.
 *
 * @param key - Environment variable name
 * @param fallback - Value returned when the variable is undefined
 */
export function parseBooleanEnv(key: string, fallback = false): boolean {
  const value = getEnvVar(key);
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Parse an environment variable into a number.
 *
 * @param key - Environment variable name
 * @param fallback - Value returned when the variable is undefined or invalid
 */
export function parseNumberEnv(key: string, fallback?: number): number | undefined {
  const value = getEnvVar(key);
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

/**
 * Parse a comma-separated environment variable into an array of strings.
 *
 * @param key - Environment variable name
 * @param fallback - Value returned when the variable is undefined
 */
export function parseArrayEnv(key: string, fallback: string[] = []): string[] {
  const value = getEnvVar(key);
  if (value === undefined) return fallback;
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
