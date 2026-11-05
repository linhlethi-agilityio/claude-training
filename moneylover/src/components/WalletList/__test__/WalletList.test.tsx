import { fireEvent, render, screen } from '@testing-library/react';

// Components
import { WalletList } from '@/components/WalletList';

// Mocks
import { MOCK_WALLETS } from '@/mocks';

describe('WalletList', () => {
  it('renders with default props', () => {
    const { container } = render(
      <WalletList wallets={MOCK_WALLETS} totalBalance={6200000} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Total wallet item', () => {
    render(<WalletList wallets={MOCK_WALLETS} totalBalance={6200000} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('renders all wallets', () => {
    render(<WalletList wallets={MOCK_WALLETS} totalBalance={6200000} />);
    MOCK_WALLETS.forEach((wallet) => {
      expect(screen.getByText(wallet.name)).toBeInTheDocument();
    });
  });

  it('marks Total as selected when no wallet is selected', () => {
    const { container } = render(
      <WalletList wallets={MOCK_WALLETS} totalBalance={6200000} selectedWalletId={null} />,
    );
    const checkPaths = container.querySelectorAll('path[d*="16.17"]');
    expect(checkPaths.length).toBeGreaterThan(0);
  });

  it('marks correct wallet as selected', () => {
    const { container } = render(
      <WalletList wallets={MOCK_WALLETS} totalBalance={6200000} selectedWalletId={MOCK_WALLETS[0].id} />,
    );
    // Exactly 1 check icon for the selected wallet
    const checkPaths = container.querySelectorAll('path[d*="16.17"]');
    expect(checkPaths.length).toBe(1);
  });

  it('calls onSelectWallet with null when Total is clicked', () => {
    const handleSelect = jest.fn();
    render(
      <WalletList wallets={MOCK_WALLETS} totalBalance={6200000} onSelectWallet={handleSelect} />,
    );
    fireEvent.click(screen.getByText('Total').closest('div')!);
    expect(handleSelect).toHaveBeenCalledWith(null);
  });

  it('calls onSelectWallet with wallet when a wallet is clicked', () => {
    const handleSelect = jest.fn();
    render(
      <WalletList wallets={MOCK_WALLETS} totalBalance={6200000} onSelectWallet={handleSelect} />,
    );
    fireEvent.click(screen.getByText(MOCK_WALLETS[0].name).closest('div')!);
    expect(handleSelect).toHaveBeenCalledWith(MOCK_WALLETS[0]);
  });

  it('calls onAddWallet when Add Wallet is clicked', () => {
    const handleAdd = jest.fn();
    render(
      <WalletList wallets={MOCK_WALLETS} totalBalance={6200000} onAddWallet={handleAdd} />,
    );
    fireEvent.click(screen.getByText(/Add Wallet/));
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });

  it('calls onEditWallet with wallet id when edit is clicked', () => {
    const handleEdit = jest.fn();
    render(
      <WalletList wallets={MOCK_WALLETS} totalBalance={6200000} onEditWallet={handleEdit} />,
    );
    // Open the first wallet's menu dropdown then click Edit
    const menuButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(menuButtons[0]);
    fireEvent.click(screen.getByText('Edit'));
    expect(handleEdit).toHaveBeenCalledWith(MOCK_WALLETS[0].id);
  });

  it('calls onDeleteWallet with wallet id when delete is clicked', () => {
    const handleDelete = jest.fn();
    render(
      <WalletList wallets={MOCK_WALLETS} totalBalance={6200000} onDeleteWallet={handleDelete} />,
    );
    // Open the first wallet's menu dropdown then click Delete
    const menuButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(menuButtons[0]);
    fireEvent.click(screen.getByText('Delete'));
    expect(handleDelete).toHaveBeenCalledWith(MOCK_WALLETS[0].id);
  });
});
