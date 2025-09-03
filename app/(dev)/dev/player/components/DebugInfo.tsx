import { memo } from 'react';
import type { Track, RepeatOptions } from '@/app/shared/player/types';

interface DebugInfoProps {
  track: Track;
  repeatOptions: RepeatOptions;
}

/**
 * Component for displaying debug information about current track and repeat settings.
 * Shows formatted JSON data for development purposes.
 */
export const DebugInfo = memo(function DebugInfo({ track, repeatOptions }: DebugInfoProps) {
  return (
    <pre className="bg-surface p-2 rounded text-xs">
      {JSON.stringify({ track, repeat: repeatOptions }, null, 2)}
    </pre>
  );
});

export default DebugInfo;
