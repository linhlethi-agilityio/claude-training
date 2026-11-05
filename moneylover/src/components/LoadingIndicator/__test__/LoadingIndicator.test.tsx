import { render } from '@testing-library/react';

// Components
import { LoadingIndicator } from '@/components/LoadingIndicator';

describe('LoadingIndicator', () => {
  it('renders with default props', () => {
    const { container } = render(<LoadingIndicator />);
    expect(container).toMatchSnapshot();
  });

  it('renders inline variant by default', () => {
    const { container } = render(<LoadingIndicator />);
    expect(container.querySelector('.fixed')).not.toBeInTheDocument();
  });

  it('renders overlay variant with fixed positioning', () => {
    const { container } = render(<LoadingIndicator variant="overlay" />);
    expect(container.querySelector('.fixed')).toBeInTheDocument();
  });

  it('renders sm size spinner', () => {
    const { container } = render(<LoadingIndicator size="sm" />);
    expect(container.querySelector('.h-4')).toBeInTheDocument();
  });

  it('renders md size spinner by default', () => {
    const { container } = render(<LoadingIndicator />);
    expect(container.querySelector('.h-6')).toBeInTheDocument();
  });
});
