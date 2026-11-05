import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// Mocks
import {
  MOCK_WALLETS,
  MOCK_GROUPED_BY_CATEGORY,
  MOCK_EXPENSE_CATEGORIES,
  MOCK_INCOME_CATEGORIES,
  MOCK_TRANSACTIONS_WITH_CATEGORY,
} from '@/mocks';

// Actions
import { deleteTransaction, updateTransaction } from '@/actions';

// Components
import { TransactionList } from '@/components/TransactionList';

jest.mock('@/actions', () => ({
  ...jest.requireActual('@/actions'),
  deleteTransaction: jest.fn(),
  updateTransaction: jest.fn(),
}));

jest.mock('@/hooks', () => ({
  ...jest.requireActual('@/hooks'),
  useToast: jest.fn(() => ({ showToast: jest.fn() })),
}));

const defaultProps = {
  userId: 'user-1',
  wallets: MOCK_WALLETS,
  inflow: 5000000,
  outflow: 200000,
  groupedByCategory: MOCK_GROUPED_BY_CATEGORY,
  expenseCategories: MOCK_EXPENSE_CATEGORIES,
  incomeCategories: MOCK_INCOME_CATEGORIES,
  getTransactionDetail: jest.fn().mockResolvedValue(MOCK_TRANSACTIONS_WITH_CATEGORY[0]),
};

describe('TransactionList', () => {
  it('renders with default props', () => {
    const { container } = render(<TransactionList {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('renders inflow and outflow summary', () => {
    render(<TransactionList {...defaultProps} />);
    expect(screen.getByText('Inflow')).toBeInTheDocument();
    expect(screen.getByText('Outflow')).toBeInTheDocument();
  });

  it('renders category names from grouped transactions', () => {
    render(<TransactionList {...defaultProps} />);
    expect(screen.getByText('Food & Beverage')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('Transportation')).toBeInTheDocument();
  });

  it('renders transaction count per category', () => {
    render(<TransactionList {...defaultProps} />);
    const transactionCounts = screen.getAllByText(/Transactions/);
    expect(transactionCounts.length).toBe(3);
  });

  it('renders empty state when no transactions', () => {
    render(<TransactionList {...defaultProps} groupedByCategory={{}} inflow={0} outflow={0} />);
    expect(screen.getByText('No transactions')).toBeInTheDocument();
  });

  it('does not render inflow/outflow summary when no transactions', () => {
    render(<TransactionList {...defaultProps} groupedByCategory={{}} inflow={0} outflow={0} />);
    expect(screen.queryByText('Inflow')).not.toBeInTheDocument();
  });

  it('renders transaction notes', () => {
    render(<TransactionList {...defaultProps} />);
    expect(screen.getByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText('Monthly salary')).toBeInTheDocument();
  });

  it('opens transaction detail modal when transaction item is clicked', async () => {
    
    render(<TransactionList {...defaultProps} />);
    fireEvent.click(screen.getByText('Lunch').closest('div')!);
    await waitFor(() => {
      expect(screen.getByText('Transaction detail')).toBeInTheDocument();
    });
  });

  it('opens confirm delete modal when delete is clicked in detail modal', async () => {
    
    render(<TransactionList {...defaultProps} />);
    fireEvent.click(screen.getByText('Lunch').closest('div')!);
    await waitFor(() => screen.getByText('Transaction detail'));
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.getByText('Delete transaction')).toBeInTheDocument();
  });

  it('closes confirm delete modal when cancel is clicked', async () => {
    
    render(<TransactionList {...defaultProps} />);
    fireEvent.click(screen.getByText('Lunch').closest('div')!);
    await waitFor(() => screen.getByText('Transaction detail'));
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Delete transaction')).not.toBeInTheDocument();
  });

  it('closes transaction detail modal when close is clicked', async () => {
    
    render(<TransactionList {...defaultProps} />);
    fireEvent.click(screen.getByText('Lunch').closest('div')!);
    await waitFor(() => screen.getByText('Transaction detail'));
    // Modal close button is the last ghost button in the modal header
    const closeBtn = screen
      .getAllByRole('button')
      .find((btn) => btn.querySelector('svg') && !btn.textContent)!;
    fireEvent.click(closeBtn);
    expect(screen.queryByText('Transaction detail')).not.toBeInTheDocument();
  });

  it('opens edit transaction modal when Edit is clicked in detail modal', async () => {
    
    render(<TransactionList {...defaultProps} />);
    fireEvent.click(screen.getByText('Lunch').closest('div')!);
    await waitFor(() => screen.getByText('Transaction detail'));
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('Update Transaction')).toBeInTheDocument();
  });

  it('closes edit modal after form submit', async () => {
    
    (updateTransaction as jest.Mock).mockResolvedValue(undefined);
    render(<TransactionList {...defaultProps} />);
    fireEvent.click(screen.getByText('Lunch').closest('div')!);
    await waitFor(() => screen.getByText('Transaction detail'));
    fireEvent.click(screen.getByText('Edit'));
    await waitFor(() => screen.getByText('Update Transaction'));
    // Dirty the note field to enable submit button
    fireEvent.change(screen.getByPlaceholderText('Add a note...'), {
      target: { value: 'Updated note' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(screen.queryByText('Update Transaction')).not.toBeInTheDocument();
    });
  });

  it('closes edit transaction modal when close is clicked', async () => {
    
    render(<TransactionList {...defaultProps} />);
    fireEvent.click(screen.getByText('Lunch').closest('div')!);
    await waitFor(() => screen.getByText('Transaction detail'));
    fireEvent.click(screen.getByText('Edit'));
    await waitFor(() => screen.getByText('Update Transaction'));
    // The close button is a sibling of the modal title heading
    const modalTitle = screen.getByText('Update Transaction');
    const closeBtn = modalTitle.parentElement!.querySelector('button')!;
    fireEvent.click(closeBtn);
    expect(screen.queryByText('Update Transaction')).not.toBeInTheDocument();
  });

  it('confirms delete and closes modal on success', async () => {
    
    (deleteTransaction as jest.Mock).mockResolvedValue(undefined);
    render(<TransactionList {...defaultProps} />);
    fireEvent.click(screen.getByText('Lunch').closest('div')!);
    await waitFor(() => screen.getByText('Transaction detail'));
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => screen.getByText('Delete transaction'));
    const deleteBtns = screen.getAllByRole('button', { name: 'Delete' });
    fireEvent.click(deleteBtns[deleteBtns.length - 1]);
    await waitFor(() => {
      expect(deleteTransaction).toHaveBeenCalledWith(MOCK_TRANSACTIONS_WITH_CATEGORY[0].id, 'user-1');
      expect(screen.queryByText('Delete transaction')).not.toBeInTheDocument();
    });
  });

  it('shows error toast when deleteTransaction fails', async () => {
    
    (deleteTransaction as jest.Mock).mockResolvedValue('Something went wrong');
    render(<TransactionList {...defaultProps} />);
    fireEvent.click(screen.getByText('Lunch').closest('div')!);
    await waitFor(() => screen.getByText('Transaction detail'));
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => screen.getByText('Delete transaction'));
    const deleteBtns = screen.getAllByRole('button', { name: 'Delete' });
    fireEvent.click(deleteBtns[deleteBtns.length - 1]);
    await waitFor(() => {
      expect(deleteTransaction).toHaveBeenCalled();
    });
  });
});
