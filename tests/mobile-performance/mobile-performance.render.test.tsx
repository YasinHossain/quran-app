import React from 'react';

import { renderWithPerf } from './helpers';

describe('mobile performance render', (): void => {
  it('measures render duration', (): void => {
    const Component = (): JSX.Element => <div>mobile test</div>;
    // Mock performance.now to return 0 first time (start), then 20 second time (end)
    const nowSpy = jest
      .spyOn(performance, 'now')
      .mockReturnValueOnce(0) // Called by perfLogger.start()
      .mockReturnValue(20); // Subsequent calls treated as end() or inner calls

    const { duration } = renderWithPerf(<Component />);
    nowSpy.mockRestore();

    expect(duration).toBe(20);
  });
});
