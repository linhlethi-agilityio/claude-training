import { render, screen } from '@testing-library/react';

// Mocks
import { MOCK_WALLETS, MOCK_TRANSACTIONS_WITH_CATEGORY } from '@/mocks';

// Components
import { RecentTransactions } from '@/components/RecentTransactions';

describe('RecentTransactions', () => {
  it('renders with default props', () => {
    const { container } = render(
      <RecentTransactions transactions={MOCK_TRANSACTIONS_WITH_CATEGORY} wallets={MOCK_WALLETS} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders My Wallets section', () => {
    render(<RecentTransactions transactions={[]} wallets={MOCK_WALLETS} />);
    expect(screen.getByText('My Wallets')).toBeInTheDocument();
  });

  it('renders all wallet names', () => {
    render(<RecentTransactions transactions={[]} wallets={MOCK_WALLETS} />);
    MOCK_WALLETS.forEach((wallet) => {
      expect(screen.getByText(wallet.name)).toBeInTheDocument();
    });
  });

  it('renders Recent transactions section', () => {
    render(<RecentTransactions transactions={[]} wallets={MOCK_WALLETS} />);
    expect(screen.getByText('Recent transactions')).toBeInTheDocument();
  });

  it('renders empty state when no transactions', () => {
    render(<RecentTransactions transactions={[]} wallets={MOCK_WALLETS} />);
    expect(screen.getByText('No transactions')).toBeInTheDocument();
  });

  it('renders transaction category names', () => {
    render(
      <RecentTransactions transactions={MOCK_TRANSACTIONS_WITH_CATEGORY} wallets={MOCK_WALLETS} />,
    );
    expect(screen.getByText('Food & Beverage')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
  });

  it('renders See all link', () => {
    render(<RecentTransactions transactions={[]} wallets={MOCK_WALLETS} />);
    expect(screen.getByRole('link', { name: 'See all' })).toBeInTheDocument();
  });
});
