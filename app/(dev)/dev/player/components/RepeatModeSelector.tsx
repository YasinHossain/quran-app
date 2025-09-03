import { memo, useCallback } from 'react';
import type { RepeatOptions } from '@/app/shared/player/types';

interface RepeatModeSelectorProps {
  repeatOptions: RepeatOptions;
  onRepeatChange: (options: RepeatOptions) => void;
}

/**
 * Component for selecting repeat mode options.
 * Handles mode selection and conditional range inputs.
 */
export const RepeatModeSelector = memo(function RepeatModeSelector({
  repeatOptions,
  onRepeatChange,
}: RepeatModeSelectorProps) {
  const handleModeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onRepeatChange({
        ...repeatOptions,
        mode: e.target.value as RepeatOptions['mode'],
      });
    },
    [repeatOptions, onRepeatChange]
  );

  const handleNumberChange = useCallback(
    (field: keyof RepeatOptions, value: number) => {
      onRepeatChange({
        ...repeatOptions,
        [field]: value,
      });
    },
    [repeatOptions, onRepeatChange]
  );

  return (
    <div className="space-y-2">
      <div>
        <label className="mr-2 font-medium" htmlFor="repeat">
          Repeat:
        </label>
        <select
          id="repeat"
          value={repeatOptions.mode}
          onChange={handleModeChange}
          className="border p-1 rounded"
        >
          <option value="off">Off</option>
          <option value="single">Single</option>
          <option value="range">Range</option>
          <option value="surah">Surah</option>
        </select>
      </div>

      {repeatOptions.mode === 'range' && (
        <div className="space-x-2">
          <label>
            Start
            <input
              type="number"
              value={repeatOptions.start}
              onChange={(e) => handleNumberChange('start', Number(e.target.value))}
              className="border ml-1 w-16 rounded p-0.5"
            />
          </label>
          <label>
            End
            <input
              type="number"
              value={repeatOptions.end}
              onChange={(e) => handleNumberChange('end', Number(e.target.value))}
              className="border ml-1 w-16 rounded p-0.5"
            />
          </label>
        </div>
      )}

      <div className="space-x-2">
        <label>
          Repeat each
          <input
            type="number"
            value={repeatOptions.repeatEach}
            onChange={(e) => handleNumberChange('repeatEach', Number(e.target.value))}
            className="border ml-1 w-16 rounded p-0.5"
          />
        </label>
        <label>
          Delay (s)
          <input
            type="number"
            value={repeatOptions.delay}
            onChange={(e) => handleNumberChange('delay', Number(e.target.value))}
            className="border ml-1 w-20 rounded p-0.5"
          />
        </label>
      </div>
    </div>
  );
});

export default RepeatModeSelector;
