import { parseArrayEnv, parseBooleanEnv, parseNumberEnv } from './utils';

/**
 * Security configuration segment.
 *
 * Enforces runtime policies like CSP and rate limiting.
 */
export interface SecurityConfig {
  enableCSP: boolean;
  enableHTTPS: boolean;
  allowedOrigins: string[];
  rateLimitRequests: number;
  rateLimitWindow: number;
}

const resolveIntAtLeast = (value: number | undefined, fallback: number, min: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.max(min, Math.trunc(value));
};

export const securityConfig: SecurityConfig = {
  enableCSP: parseBooleanEnv('SECURITY_ENABLE_CSP', true),
  enableHTTPS: parseBooleanEnv('SECURITY_ENABLE_HTTPS', true),
  allowedOrigins: parseArrayEnv('SECURITY_ALLOWED_ORIGINS', []),
  rateLimitRequests: resolveIntAtLeast(parseNumberEnv('SECURITY_RATE_LIMIT_REQUESTS', 100), 100, 1),
  rateLimitWindow: resolveIntAtLeast(parseNumberEnv('SECURITY_RATE_LIMIT_WINDOW', 60000), 60000, 1000),
};
