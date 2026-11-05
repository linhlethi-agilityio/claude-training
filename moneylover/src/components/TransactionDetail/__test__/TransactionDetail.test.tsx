import { fireEvent, render, screen } from '@testing-library/react';

// Mocks
import { MOCK_TRANSACTIONS_WITH_CATEGORY, MOCK_WALLETS } from '@/mocks';

// Components
import { TransactionDetailModal } from '@/components/TransactionDetail';

const props = {
  transaction: MOCK_TRANSACTIONS_WITH_CATEGORY[0],
  wallets: MOCK_WALLETS,
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onClose: jest.fn(),
};

describe('TransactionDetailModal', () => {
  it('renders with default props', () => {
    const { container } = render(<TransactionDetailModal {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('renders the modal title', () => {
    render(<TransactionDetailModal {...props} />);
    expect(screen.getByText('Transaction detail')).toBeInTheDocument();
  });

  it('renders Edit and Delete buttons', () => {
    render(<TransactionDetailModal {...props} />);
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('renders category name', () => {
    render(<TransactionDetailModal {...props} />);
    expect(screen.getByText(MOCK_TRANSACTIONS_WITH_CATEGORY[0].category.name)).toBeInTheDocument();
  });

  it('renders note when provided', () => {
    render(<TransactionDetailModal {...props} />);
    expect(screen.getByText(MOCK_TRANSACTIONS_WITH_CATEGORY[0].note)).toBeInTheDocument();
  });

  it('renders wallet name when wallet matches', () => {
    render(<TransactionDetailModal {...props} />);
    expect(screen.getByText(/Cash/)).toBeInTheDocument();
  });

  it('renders amount in red for expense', () => {
    render(<TransactionDetailModal {...props} />);
    const amountEl = screen.getByText(/150,000|150\.000/);
    expect(amountEl).toHaveClass('text-red-500');
  });

  it('renders amount in blue for income', () => {
    render(<TransactionDetailModal {...props} transaction={MOCK_TRANSACTIONS_WITH_CATEGORY[1]} />);
    const amountEl = screen.getByText(/5,000,000|5\.000\.000/);
    expect(amountEl).toHaveClass('text-blue-500');
  });

  it('calls onEdit when Edit is clicked', () => {
    const handleEdit = jest.fn();
    render(<TransactionDetailModal {...props} onEdit={handleEdit} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(handleEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when Delete is clicked', () => {
    const handleDelete = jest.fn();
    render(<TransactionDetailModal {...props} onDelete={handleDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when modal close button is clicked', () => {
    const handleClose = jest.fn();
    const { container } = render(<TransactionDetailModal {...props} onClose={handleClose} />);
    // Close button is the last button in the modal header (CloseIcon, no text)
    const allButtons = container.querySelectorAll('button');
    fireEvent.click(allButtons[0]);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not render wallet name when no wallet matches', () => {
    render(
      <TransactionDetailModal
        {...props}
        transaction={{ ...MOCK_TRANSACTIONS_WITH_CATEGORY[0], wallet_id: 'nonexistent' }}
      />,
    );
    expect(screen.queryByText(/Wallet:/)).not.toBeInTheDocument();
  });

  it('does not render note when note is empty', () => {
    render(
      <TransactionDetailModal
        {...props}
        transaction={{ ...MOCK_TRANSACTIONS_WITH_CATEGORY[2], note: '' }}
      />,
    );
    // note paragraph is only rendered when note is truthy
    expect(screen.queryByText('Monthly salary')).not.toBeInTheDocument();
  });
});
