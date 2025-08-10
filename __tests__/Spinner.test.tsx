import { render } from '@testing-library/react';
import Spinner from '@/app/components/shared/Spinner';

describe('Spinner', () => {
  it('renders an SVG element', () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('animate-spin');
  });

  it('applies a custom class name', () => {
    const { container } = render(<Spinner className="test-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('test-class');
  });
});
