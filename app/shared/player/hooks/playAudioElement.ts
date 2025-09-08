import { logger } from '@/src/infrastructure/monitoring/Logger';

export function playAudioElement(
  audio: HTMLAudioElement,
  onError?: (error: unknown) => void,
): void {
  audio.play().catch((err) => {
    if (err instanceof DOMException && err.name === 'AbortError') return;
    if (onError) onError(err);
    else logger.error(err);
  });
}
