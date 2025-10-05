import { render } from '@testing-library/react';
import { ComponentType } from 'react';

let renderCount = 0;
let lastProps: unknown = null;

export function withRenderTracking<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  const TrackedComponent: ComponentType<P> = (props: P) => {
    renderCount++;
    lastProps = props;
    return <Component {...props} />;
  };

  TrackedComponent.displayName = `TrackedComponent(${Component.displayName || Component.name})`;
  return TrackedComponent;
}
export function resetRenderTracking(): void {
  renderCount = 0;
  lastProps = null;
}

export function getRenderCount(): number {
  return renderCount;
}

export function getLastProps<P>(): P | null {
  return lastProps as P | null;
}

export function testMemoization<P extends object>(
  Component: ComponentType<P>,
  initialProps: P
): {
  renderCount: number;
  rerender: (props: P) => void;
  unmount: () => void;
} {
  resetRenderTracking();

  const TrackedComponent = withRenderTracking(Component);
  const { rerender, unmount } = render(<TrackedComponent {...initialProps} />);

  const initialRenderCount = getRenderCount();

  return {
    renderCount: initialRenderCount,
    rerender: (newProps: P) => {
      rerender(<TrackedComponent {...newProps} />);
    },
    unmount,
  };
}
