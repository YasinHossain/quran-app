import { render } from '@testing-library/react';
import React from 'react';

import { clickWithPerf } from './helpers';

describe('mobile performance interaction', () => {
  it('measures interaction duration', () => {
    function Component(): React.JSX.Element {
      return <button type="button">tap</button>;
    }

    const { getByRole } = render(<Component />);
    const button = getByRole('button');

    // Mock performance.now to return 0 first time (start), then 10 second time (end)
    const nowSpy = jest
      .spyOn(performance, 'now')
      .mockReturnValueOnce(0) // Called by perfLogger.start()
      .mockReturnValue(10); // Subsequent calls treated as end() or inner calls

    const duration = clickWithPerf(button);
    nowSpy.mockRestore();

    expect(duration).toBe(10);
  });
});
