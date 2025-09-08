import React from 'react';

import { renderWithPerf } from './helpers';

describe('mobile performance render', (): void => {
  it('measures render duration', (): void => {
    const Component = (): JSX.Element => <div>mobile test</div>;
    const nowSpy = jest.spyOn(performance, 'now').mockReturnValueOnce(0).mockReturnValueOnce(20);

    const { duration } = renderWithPerf(<Component />);
    nowSpy.mockRestore();

    expect(duration).toBe(20);
  });
});
