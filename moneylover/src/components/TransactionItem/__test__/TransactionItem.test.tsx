import { fireEvent, render, screen } from '@testing-library/react';

// Types
import { FinanceType } from '@/types';

// Components
import { TransactionItem } from '@/components/TransactionItem';

const defaultProps = {
  date: '2024-03-15',
  amount: 150000,
  type: FinanceType.Expense,
  onClick: jest.fn(),
};

describe('TransactionItem', () => {
  it('renders with default props', () => {
    const { container } = render(<TransactionItem {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('renders the date', () => {
    render(<TransactionItem {...defaultProps} />);
    expect(screen.getByText(/March/i)).toBeInTheDocument();
  });

  it('renders note when provided', () => {
    render(<TransactionItem {...defaultProps} note="Lunch" />);
    expect(screen.getByText('Lunch')).toBeInTheDocument();
  });

  it('does not render note when not provided', () => {
    render(<TransactionItem {...defaultProps} />);
    expect(screen.queryByText('Lunch')).not.toBeInTheDocument();
  });

  it('renders amount in red for expense type', () => {
    render(<TransactionItem {...defaultProps} type={FinanceType.Expense} />);
    const amountEl = screen.getByText(/150,000|150\.000/);
    expect(amountEl).toHaveClass('text-red-500');
  });

  it('renders amount in blue for income type', () => {
    render(<TransactionItem {...defaultProps} type={FinanceType.Income} />);
    const amountEl = screen.getByText(/150,000|150\.000/);
    expect(amountEl).toHaveClass('text-blue-500');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<TransactionItem {...defaultProps} onClick={handleClick} />);
    fireEvent.click(screen.getByText(/March/i).closest('div')!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
