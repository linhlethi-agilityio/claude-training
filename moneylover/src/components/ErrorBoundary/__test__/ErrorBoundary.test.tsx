import { fireEvent, render, screen } from '@testing-library/react';

// Components
import { ErrorBoundary } from '@/components/ErrorBoundary';

describe('ErrorBoundary', () => {
  it('renders with default props', () => {
    const { container } = render(<ErrorBoundary error="Something went wrong" />);
    expect(container).toMatchSnapshot();
  });

  it('renders heading', () => {
    render(<ErrorBoundary error="Something went wrong" />);
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
  });

  it('renders error message from string', () => {
    render(<ErrorBoundary error="Network error" />);
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('renders error message from Error object', () => {
    render(<ErrorBoundary error={new Error('Fetch failed')} />);
    expect(screen.getByText('Fetch failed')).toBeInTheDocument();
  });

  it('renders Try again and Go Home buttons', () => {
    render(<ErrorBoundary error="Error" />);
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go Home' })).toBeInTheDocument();
  });

  it('calls reset when Try again is clicked', () => {
    const handleReset = jest.fn();
    render(<ErrorBoundary error="Error" reset={handleReset} />);
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('does not throw when reset is not provided', () => {
    render(<ErrorBoundary error="Error" />);
    expect(() => fireEvent.click(screen.getByRole('button', { name: 'Try again' }))).not.toThrow();
  });
});
