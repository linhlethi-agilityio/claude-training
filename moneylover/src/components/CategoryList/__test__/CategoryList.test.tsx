import { fireEvent, render, screen } from '@testing-library/react';

// Mocks
import { MOCK_EXPENSE_CATEGORIES, MOCK_INCOME_CATEGORIES, MOCK_SUB_CATEGORIES } from '@/mocks';

// Components
import { CategoryList } from '@/components/CategoryList';

const defaultProps = {
  userId: 'user-1',
  expenseCategories: MOCK_EXPENSE_CATEGORIES,
  incomeCategories: MOCK_INCOME_CATEGORIES,
  subCategories: MOCK_SUB_CATEGORIES,
};

describe('CategoryList', () => {
  it('renders with default props', () => {
    const { container } = render(<CategoryList {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('renders Expense and Income tab buttons', () => {
    render(<CategoryList {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Expense' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Income' })).toBeInTheDocument();
  });

  it('renders expense categories by default', () => {
    render(<CategoryList {...defaultProps} />);
    expect(screen.getByText('Food & Beverage')).toBeInTheDocument();
    expect(screen.queryByText('Salary')).not.toBeInTheDocument();
  });

  it('switches to income categories when Income tab is clicked', () => {
    render(<CategoryList {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Income' }));
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.queryByText('Food & Beverage')).not.toBeInTheDocument();
  });

  it('renders New category button', () => {
    render(<CategoryList {...defaultProps} />);
    expect(screen.getByRole('button', { name: /New category/i })).toBeInTheDocument();
  });

  it('opens New Category modal when New category is clicked', () => {
    render(<CategoryList {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /New category/i }));
    expect(screen.getByText('New Category')).toBeInTheDocument();
  });

  it('shows empty state when no categories', () => {
    render(<CategoryList {...defaultProps} expenseCategories={[]} incomeCategories={[]} />);
    expect(screen.getByText('No categories yet')).toBeInTheDocument();
  });

  it('opens delete confirm modal when delete is triggered', () => {
    render(<CategoryList {...defaultProps} />);
    // Open menu of first category
    const menuButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(menuButtons[0]);
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.getByText('Delete Category')).toBeInTheDocument();
  });

  it('opens edit modal when edit is triggered', () => {
    render(<CategoryList {...defaultProps} />);
    const menuButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(menuButtons[0]);
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('Edit Category')).toBeInTheDocument();
  });
});
