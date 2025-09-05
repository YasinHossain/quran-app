import { memo, useCallback } from 'react';
import type { Track } from '@/app/shared/player/types';

interface ReciterSelectorProps {
  tracks: Track[];
  selectedTrack: Track;
  onTrackChange: (track: Track) => void;
}

/**
 * Component for selecting a reciter from available demo tracks.
 * Provides a dropdown interface for switching between reciters.
 */
export const ReciterSelector = memo(function ReciterSelector({
  tracks,
  selectedTrack,
  onTrackChange,
}: ReciterSelectorProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const track = tracks.find((t) => t.id === e.target.value);
      if (track) {
        onTrackChange(track);
      }
    },
    [tracks, onTrackChange]
  );

  return (
    <div>
      <label className="mr-2 font-medium" htmlFor="reciter">
        Reciter:
      </label>
      <select
        id="reciter"
        value={selectedTrack.id}
        onChange={handleChange}
        className="border p-1 rounded"
      >
        {tracks.map((track) => (
          <option key={track.id} value={track.id}>
            {track.artist}
          </option>
        ))}
      </select>
    </div>
  );
});

