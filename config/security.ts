import { z } from 'zod';

import { parseArrayEnv, parseBooleanEnv, parseNumberEnv } from './utils';

/**
 * Security configuration segment.
 *
 * Enforces runtime policies like CSP and rate limiting.
 */
export const securitySchema = z.object({
  enableCSP: z.boolean().default(true),
  enableHTTPS: z.boolean().default(true),
  allowedOrigins: z.array(z.string()).default([]),
  rateLimitRequests: z.number().int().min(1).default(100),
  rateLimitWindow: z.number().int().min(1000).default(60000),
});

export type SecurityConfig = z.infer<typeof securitySchema>;

export const securityConfig: SecurityConfig = {
  enableCSP: parseBooleanEnv('SECURITY_ENABLE_CSP', true),
  enableHTTPS: parseBooleanEnv('SECURITY_ENABLE_HTTPS', true),
  allowedOrigins: parseArrayEnv('SECURITY_ALLOWED_ORIGINS', []),
  rateLimitRequests: parseNumberEnv('SECURITY_RATE_LIMIT_REQUESTS', 100)!,
  rateLimitWindow: parseNumberEnv('SECURITY_RATE_LIMIT_WINDOW', 60000)!,
};
