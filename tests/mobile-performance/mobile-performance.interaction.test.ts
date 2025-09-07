import React from 'react';
import { render } from '@testing-library/react';
import { clickWithPerf } from './helpers';

describe('mobile performance interaction', () => {
  it('measures interaction duration', () => {
    function Component(): React.JSX.Element {
      return <button type="button">tap</button>;
    }

    const { getByRole } = render(<Component />);
    const button = getByRole('button');

    const nowSpy = jest
      .spyOn(performance, 'now')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(10);

    const duration = clickWithPerf(button);
    nowSpy.mockRestore();

    expect(duration).toBe(10);
  });
});
