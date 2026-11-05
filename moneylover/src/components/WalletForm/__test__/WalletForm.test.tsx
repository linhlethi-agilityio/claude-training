import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';

// Mocks
import { MOCK_WALLETS } from '@/mocks';

// Actions
import { createWallet, updateWallet } from '@/actions';

// Components
import { WalletForm } from '@/components/WalletForm';

jest.mock('@/actions', () => ({
  ...jest.requireActual('@/actions'),
  createWallet: jest.fn(),
  updateWallet: jest.fn(),
}));

jest.mock('@/hooks', () => ({
  ...jest.requireActual('@/hooks'),
  useToast: jest.fn(() => ({ showToast: jest.fn() })),
}));

describe('WalletForm', () => {
  it('renders create form with default props', () => {
    const { container } = render(<WalletForm userId="user-1" />);
    expect(container).toMatchSnapshot();
  });

  it('renders wallet name input', () => {
    render(<WalletForm userId="user-1" />);
    expect(screen.getByPlaceholderText('e.g. Cash, Bank Account')).toBeInTheDocument();
  });

  it('renders Submit button in create mode', () => {
    render(<WalletForm userId="user-1" />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('renders Save button in edit mode', () => {
    render(<WalletForm userId="user-1" previewData={MOCK_WALLETS[0]} />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('pre-fills wallet name in edit mode', () => {
    render(<WalletForm userId="user-1" previewData={MOCK_WALLETS[0]} />);
    expect(screen.getByDisplayValue(MOCK_WALLETS[0].name)).toBeInTheDocument();
  });

  it('shows balance input when showBalance is true', () => {
    render(<WalletForm userId="user-1" showBalance />);
    expect(screen.getByText('Initial Balance')).toBeInTheDocument();
  });

  it('does not show balance input when showBalance is false', () => {
    render(<WalletForm userId="user-1" showBalance={false} />);
    expect(screen.queryByText('Initial Balance')).not.toBeInTheDocument();
  });

  it('submit button is disabled when name is empty', () => {
    render(<WalletForm userId="user-1" />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('submit button is enabled after filling wallet name', async () => {
    render(<WalletForm userId="user-1" />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Cash, Bank Account'), {
      target: { value: 'My Wallet' },
    });
    expect(screen.getByRole('button', { name: 'Submit' })).not.toBeDisabled();
  });

  it('changes currency selection when a currency option is clicked', () => {
    render(<WalletForm userId="user-1" />);
    // Click on USD currency option
    fireEvent.click(screen.getByText('USD'));
    expect(screen.getByText('USD')).toBeInTheDocument();
  });

  it('fills balance field with formatted value', () => {
    render(<WalletForm userId="user-1" showBalance />);
    const balanceInput = screen.getByPlaceholderText('0');
    fireEvent.change(balanceInput, { target: { value: '100000' } });
    expect(balanceInput).toHaveValue('100,000');
  });

  it('calls createWallet on submit in create mode', async () => {
    (createWallet as jest.Mock).mockResolvedValue(undefined);
    const onSubmit = jest.fn();
    render(<WalletForm userId="user-1" onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('e.g. Cash, Bank Account'), {
      target: { value: 'My Wallet' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(createWallet).toHaveBeenCalled();
    });
  });

  it('calls updateWallet on submit in edit mode', async () => {
    (updateWallet as jest.Mock).mockResolvedValue(undefined);
    const onSubmit = jest.fn();
    render(<WalletForm userId="user-1" previewData={MOCK_WALLETS[0]} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByDisplayValue(MOCK_WALLETS[0].name), {
      target: { value: 'Updated Wallet' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(updateWallet).toHaveBeenCalled();
    });
  });

  it('shows error toast when createWallet fails', async () => {
    (createWallet as jest.Mock).mockResolvedValue('Something went wrong');
    render(<WalletForm userId="user-1" onSubmit={jest.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('e.g. Cash, Bank Account'), {
      target: { value: 'My Wallet' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(createWallet).toHaveBeenCalled();
    });
  });

  it('calls router.replace when no onSubmit callback is provided', async () => {
    const mockReplace = jest.fn();
    jest
      .mocked(useRouter)
      .mockReturnValue({
        push: jest.fn(),
        replace: mockReplace,
        refresh: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        prefetch: jest.fn(),
      });
    (createWallet as jest.Mock).mockResolvedValue(undefined);
    render(<WalletForm userId="user-1" />);

    fireEvent.change(screen.getByPlaceholderText('e.g. Cash, Bank Account'), {
      target: { value: 'My Wallet' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled();
    });
  });
});
