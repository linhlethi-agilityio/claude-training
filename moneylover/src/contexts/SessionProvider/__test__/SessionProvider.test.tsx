import { render, screen } from '@testing-library/react';

// Contexts
import SessionProvider from '@/contexts/SessionProvider';

describe('SessionProvider', () => {
  it('renders children', () => {
    render(
      <SessionProvider>
        <p>child content</p>
      </SessionProvider>,
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });
});
