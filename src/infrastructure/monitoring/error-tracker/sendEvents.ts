import { fetchWithTimeout } from '@/lib/api/client';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import type { Transport } from './transport';

export interface TrackerEvent {
  type: 'error' | 'message';
  data: unknown;
  timestamp: number;
}

export async function sendEvents(transport: Transport, events: TrackerEvent[]): Promise<void> {
  try {
    await fetchWithTimeout(transport.endpoint, {
      method: 'POST',
      headers: transport.headers,
      body: JSON.stringify({ events }),
      errorPrefix: 'Failed to send error tracking data',
    });
  } catch (error) {
    logger.warn('Failed to send error tracking data', undefined, error as Error);
    throw error;
  }
}
