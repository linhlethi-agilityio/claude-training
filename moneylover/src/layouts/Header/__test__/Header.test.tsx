import { fireEvent, render, screen } from '@testing-library/react';

// Mocks
import { MOCK_WALLETS, MOCK_EXPENSE_CATEGORIES, MOCK_INCOME_CATEGORIES } from '@/mocks';

// Layouts
import Header from '@/layouts/Header';

const defaultProps = {
  userId: 'user-1',
  totalBalance: 6000200,
  currency: 'VND',
  wallets: MOCK_WALLETS,
  expenseCategories: MOCK_EXPENSE_CATEGORIES,
  incomeCategories: MOCK_INCOME_CATEGORIES,
};

describe('Header', () => {
  it('renders with default props', () => {
    const { container } = render(<Header {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('renders Add Transaction button', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Add Transaction/i })).toBeInTheDocument();
  });

  it('does not show SearchInput on dashboard page', () => {
    render(<Header {...defaultProps} />);
    expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
  });

  it('shows SearchInput on non-dashboard pages', () => {
    const { usePathname } = jest.requireMock('next/navigation');
    usePathname.mockReturnValueOnce('/transactions');
    render(<Header {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('opens Add Transaction modal when button is clicked', () => {
    render(<Header {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Transaction/i }));
    // Modal title appears as h2
    expect(screen.getByRole('heading', { name: 'Add Transaction' })).toBeInTheDocument();
  });

  it('renders WalletSelector', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
  });
});
