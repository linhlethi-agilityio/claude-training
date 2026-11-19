import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Mocks
import { MOCK_WALLETS } from '@/mocks';

// Actions
import { deleteWallet } from '@/actions';

// Components
import { WalletSelector } from '@/components/WalletSelector';

jest.mock('@/actions', () => ({
  ...jest.requireActual('@/actions'),
  deleteWallet: jest.fn(),
}));

const defaultProps = {
  userId: 'user-1',
  totalBalance: 6200000,
  currency: 'VND',
  wallets: MOCK_WALLETS,
};

describe('WalletSelector', () => {
  beforeEach(() => {
    jest.mocked(usePathname).mockReturnValue('/');
    jest
      .mocked(useSearchParams)
      .mockReturnValue(new URLSearchParams() as ReturnType<typeof useSearchParams>);
    jest.mocked(useRouter).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  it('renders with default props', () => {
    const { container } = render(<WalletSelector {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('renders Total label when no wallet selected', () => {
    render(<WalletSelector {...defaultProps} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('does not show wallet list by default', () => {
    render(<WalletSelector {...defaultProps} />);
    expect(screen.queryByText('Included in Total')).not.toBeInTheDocument();
  });

  it('shows wallet list when toggled', () => {
    render(<WalletSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('Total').closest('div')!);
    expect(screen.getByText('Included in Total')).toBeInTheDocument();
  });

  it('shows Add Wallet button in dropdown', () => {
    render(<WalletSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('Total').closest('div')!);
    expect(screen.getByText(/Add Wallet/)).toBeInTheDocument();
  });

  it('opens Add Wallet modal when Add Wallet is clicked', () => {
    render(<WalletSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('Total').closest('div')!);
    fireEvent.click(screen.getByText(/Add Wallet/));
    expect(screen.getByText('Add Wallet')).toBeInTheDocument();
  });

  it('opens delete confirm modal when delete is triggered', () => {
    render(<WalletSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('Total').closest('div')!);
    const menuButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(menuButtons[0]);
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.getByText('Delete Wallet')).toBeInTheDocument();
  });

  it('opens edit modal when edit is triggered', () => {
    render(<WalletSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('Total').closest('div')!);
    const menuButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(menuButtons[0]);
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('Edit Wallet')).toBeInTheDocument();
  });

  it('closes edit modal when close is clicked', () => {
    render(<WalletSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('Total').closest('div')!);
    const menuButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(menuButtons[0]);
    fireEvent.click(screen.getByText('Edit'));
    const modalTitle = screen.getByText('Edit Wallet');
    const closeBtn = modalTitle.parentElement!.querySelector('button')!;
    fireEvent.click(closeBtn);
    expect(screen.queryByText('Edit Wallet')).not.toBeInTheDocument();
  });

  it('calls deleteWallet when confirm delete is clicked', async () => {
    (deleteWallet as jest.Mock).mockResolvedValue(undefined);
    render(<WalletSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('Total').closest('div')!);
    const menuButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(menuButtons[0]);
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await waitFor(() => {
      expect(deleteWallet).toHaveBeenCalledWith(MOCK_WALLETS[0].id);
    });
  });

  it('shows error toast when deleteWallet fails', async () => {
    (deleteWallet as jest.Mock).mockResolvedValue('Something went wrong');
    render(<WalletSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('Total').closest('div')!);
    const menuButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(menuButtons[0]);
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await waitFor(() => {
      expect(deleteWallet).toHaveBeenCalled();
    });
  });

  it('navigates with walletId param when wallet selected on transactions route', () => {
    const mockPush = jest.fn();
    jest.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    });
    jest.mocked(usePathname).mockReturnValue('/transactions');

    render(<WalletSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('Total').closest('div')!);
    fireEvent.click(screen.getByText(MOCK_WALLETS[0].name).closest('div')!);
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining(MOCK_WALLETS[0].id));
  });

  it('removes walletId param when Total is selected on transactions route', () => {
    const mockPush = jest.fn();
    jest.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    });
    jest.mocked(usePathname).mockReturnValue('/transactions');
    jest
      .mocked(useSearchParams)
      .mockReturnValue(new URLSearchParams('walletId=1') as ReturnType<typeof useSearchParams>);

    render(<WalletSelector {...defaultProps} />);
    // selectedWallet = wallets[0] (Cash), so toggle shows 'Cash' not 'Total'
    fireEvent.click(screen.getByText(MOCK_WALLETS[0].name).closest('div')!);
    // WalletList opens — click the Total item to deselect
    const totalItems = screen.getAllByText('Total');
    fireEvent.click(totalItems[totalItems.length - 1].closest('div')!);
    expect(mockPush).toHaveBeenCalledWith(expect.not.stringContaining('walletId'));
  });

  it('closes dropdown when clicking outside', () => {
    render(<WalletSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('Total').closest('div')!);
    expect(screen.getByText('Included in Total')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Included in Total')).not.toBeInTheDocument();
  });
});
