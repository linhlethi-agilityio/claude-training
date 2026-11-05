import { render, screen } from '@testing-library/react';

// Layouts
import Sidebar from '@/layouts/Sidebar';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn().mockReturnValue({
    data: { user: { email: 'test@example.com' } },
  }),
}));

describe('Sidebar', () => {
  it('renders with default props', () => {
    const { container } = render(<Sidebar />);
    expect(container).toMatchSnapshot();
  });

  it('renders navigation links', () => {
    render(<Sidebar />);
    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Transactions/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Categories/i })).toBeInTheDocument();
  });

  it('renders user email from session', () => {
    render(<Sidebar />);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('renders Logout button', () => {
    render(<Sidebar />);
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });

  it('renders without email when session is null', () => {
    const { useSession } = jest.requireMock('next-auth/react');
    useSession.mockReturnValueOnce({ data: null });
    render(<Sidebar />);
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
  });

  it('highlights Dashboard link when pathname is /', () => {
    // Global mock returns '/' which matches ROUTES.DASHBOARD
    render(<Sidebar />);
    expect(screen.getByRole('link', { name: /Dashboard/i })).toHaveClass('text-lime-600');
  });

  it('does not highlight Transactions link when on dashboard', () => {
    render(<Sidebar />);
    expect(screen.getByRole('link', { name: /Transactions/i })).not.toHaveClass('text-lime-600');
  });
});
