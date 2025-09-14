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
    const duration = clickWithPerf(button);

    expect(duration).toBe(10);
  });
});
