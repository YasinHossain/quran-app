import React from 'react';

import { renderWithPerf } from './helpers';

describe('mobile performance render', (): void => {
  it('measures render duration', (): void => {
    const Component = (): JSX.Element => <div>mobile test</div>;
    const { duration } = renderWithPerf(<Component />);

    expect(duration).toBe(90);
  });
});
