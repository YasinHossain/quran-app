import { ApplicationError } from '@/src/infrastructure/errors/ApplicationError';

export function formatError(error: ApplicationError): string {
  return `[${error.code}] ${error.message}`;
}
