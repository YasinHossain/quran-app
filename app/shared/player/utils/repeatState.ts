import { useState } from 'react';

import type { RepeatOptions } from '../types';

export function useRepeatState(): {
  repeatOptions: RepeatOptions;
  setRepeatOptions: React.Dispatch<React.SetStateAction<RepeatOptions>>;
} {
  const [repeatOptions, setRepeatOptions] = useState<RepeatOptions>({
    mode: 'off',
    start: 1,
    end: 1,
    playCount: 1,
    repeatEach: 1,
    delay: 0,
  });
  return { repeatOptions, setRepeatOptions } as const;
}
