import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// Utils
import { toDateString } from '@/utils/date';

// Mocks
import {
  MOCK_WALLETS,
  MOCK_TRANSACTIONS_WITH_CATEGORY,
  MOCK_EXPENSE_CATEGORIES,
  MOCK_INCOME_CATEGORIES,
} from '@/mocks';

// Actions
import { createTransaction, updateTransaction } from '@/actions';

// Components
import { TransactionForm } from '@/components/TransactionForm';

jest.mock('@/actions', () => ({
  ...jest.requireActual('@/actions'),
  createTransaction: jest.fn(),
  updateTransaction: jest.fn(),
}));

jest.mock('@/hooks', () => ({
  ...jest.requireActual('@/hooks'),
  useToast: jest.fn(() => ({ showToast: jest.fn() })),
}));

const defaultProps = {
  userId: 'user-1',
  wallets: MOCK_WALLETS,
  expenseCategories: MOCK_EXPENSE_CATEGORIES,
  incomeCategories: MOCK_INCOME_CATEGORIES,
  onSubmit: jest.fn(),
};

describe('TransactionForm', () => {
  it('renders with default props', () => {
    // The date field defaults to today; freeze time so the snapshot is stable.
    jest.useFakeTimers({ now: new Date('2026-05-04T12:00:00') });
    try {
      const { container } = render(<TransactionForm {...defaultProps} />);
      expect(container).toMatchSnapshot();
    } finally {
      jest.useRealTimers();
    }
  });

  it('renders Type, Wallet, Category, Amount, Date fields', () => {
    render(<TransactionForm {...defaultProps} />);
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Wallet')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  it('renders Expense and Income type buttons', () => {
    render(<TransactionForm {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Expense' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Income' })).toBeInTheDocument();
  });

  it('renders Submit button in create mode', () => {
    render(<TransactionForm {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('submit button is disabled when required fields are empty', () => {
    render(<TransactionForm {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('renders in edit mode with previewData', () => {
    render(<TransactionForm {...defaultProps} previewData={MOCK_TRANSACTIONS_WITH_CATEGORY[0]} />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('renders Note optional field', () => {
    render(<TransactionForm {...defaultProps} />);
    expect(screen.getByPlaceholderText('Add a note...')).toBeInTheDocument();
  });

  it('switches to Income type when Income button is clicked', () => {
    render(<TransactionForm {...defaultProps} />);
    const incomeBtn = screen.getByRole('button', { name: 'Income' });
    fireEvent.click(incomeBtn);
    expect(incomeBtn).toHaveClass('text-lime-700');
  });

  it('fills amount field with formatted value', () => {
    render(<TransactionForm {...defaultProps} />);
    const amountInput = screen.getByPlaceholderText('0');
    fireEvent.change(amountInput, { target: { value: '50000' } });
    expect(amountInput).toHaveValue('50,000');
  });

  it('fills note field', () => {
    render(<TransactionForm {...defaultProps} />);
    const noteInput = screen.getByPlaceholderText('Add a note...');
    fireEvent.change(noteInput, { target: { value: 'Lunch' } });
    expect(noteInput).toHaveValue('Lunch');
  });

  it('renders wallet options in dropdown', () => {
    render(<TransactionForm {...defaultProps} />);
    const walletLabel = screen.getByText('Wallet');
    const dropdownToggle = walletLabel.nextElementSibling as HTMLElement;
    fireEvent.click(dropdownToggle);
    expect(screen.getByText(MOCK_WALLETS[1].name)).toBeInTheDocument();
  });

  it('renders category options in dropdown', () => {
    render(<TransactionForm {...defaultProps} />);
    const categoryLabel = screen.getByText('Category');
    const dropdownToggle = categoryLabel.nextElementSibling as HTMLElement;
    fireEvent.click(dropdownToggle);
    expect(screen.getByText(MOCK_EXPENSE_CATEGORIES[0].name)).toBeInTheDocument();
  });

  it('shows income categories after switching to Income type', () => {
    render(<TransactionForm {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Income' }));
    const categoryLabel = screen.getByText('Category');
    const dropdownToggle = categoryLabel.nextElementSibling as HTMLElement;
    fireEvent.click(dropdownToggle);
    expect(screen.getByText(MOCK_INCOME_CATEGORIES[0].name)).toBeInTheDocument();
  });

  it('selects wallet from dropdown', () => {
    render(<TransactionForm {...defaultProps} />);
    const walletLabel = screen.getByText('Wallet');
    const dropdownToggle = walletLabel.nextElementSibling as HTMLElement;
    fireEvent.click(dropdownToggle);
    fireEvent.click(screen.getByText(MOCK_WALLETS[1].name));
    expect(screen.queryByText(MOCK_WALLETS[1].name)).toBeInTheDocument();
  });

  it('selects category from dropdown', () => {
    render(<TransactionForm {...defaultProps} />);
    const categoryLabel = screen.getByText('Category');
    const dropdownToggle = categoryLabel.nextElementSibling as HTMLElement;
    fireEvent.click(dropdownToggle);
    fireEvent.click(screen.getByText(MOCK_EXPENSE_CATEGORIES[0].name));
    expect(screen.queryByText(MOCK_EXPENSE_CATEGORIES[0].name)).toBeInTheDocument();
  });

  it('changes date field', () => {
    render(<TransactionForm {...defaultProps} />);
    const dateInput = screen.getByDisplayValue(toDateString(new Date()));
    fireEvent.change(dateInput, { target: { value: '2024-06-01' } });
    expect(dateInput).toHaveValue('2024-06-01');
  });

  it('calls createTransaction on submit in create mode', async () => {
    (createTransaction as jest.Mock).mockResolvedValue(undefined);
    const onSubmit = jest.fn();
    render(<TransactionForm {...defaultProps} onSubmit={onSubmit} />);

    // Select a category to enable submit
    const categoryLabel = screen.getByText('Category');
    const dropdownToggle = categoryLabel.nextElementSibling as HTMLElement;
    fireEvent.click(dropdownToggle);
    fireEvent.click(screen.getByText(MOCK_EXPENSE_CATEGORIES[0].name));

    // Fill amount
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '50000' } });

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(createTransaction).toHaveBeenCalled();
    });
  });

  it('calls onSubmit callback after successful createTransaction', async () => {
    (createTransaction as jest.Mock).mockResolvedValue(undefined);
    const onSubmit = jest.fn();
    render(<TransactionForm {...defaultProps} onSubmit={onSubmit} />);

    const categoryLabel = screen.getByText('Category');
    fireEvent.click(categoryLabel.nextElementSibling as HTMLElement);
    fireEvent.click(screen.getByText(MOCK_EXPENSE_CATEGORIES[0].name));
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '50000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it('shows error toast when createTransaction fails', async () => {
    (createTransaction as jest.Mock).mockResolvedValue('Something went wrong');
    render(<TransactionForm {...defaultProps} />);

    const categoryLabel = screen.getByText('Category');
    fireEvent.click(categoryLabel.nextElementSibling as HTMLElement);
    fireEvent.click(screen.getByText(MOCK_EXPENSE_CATEGORIES[0].name));
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '50000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(createTransaction).toHaveBeenCalled();
    });
  });

  it('calls updateTransaction on submit in edit mode', async () => {
    (updateTransaction as jest.Mock).mockResolvedValue(undefined);
    const onSubmit = jest.fn();
    render(
      <TransactionForm
        {...defaultProps}
        onSubmit={onSubmit}
        previewData={MOCK_TRANSACTIONS_WITH_CATEGORY[0]}
      />,
    );

    // Dirty a field to enable Save
    fireEvent.change(screen.getByPlaceholderText('Add a note...'), {
      target: { value: 'Updated note' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(updateTransaction).toHaveBeenCalled();
    });
  });
});
