import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// Mocks
import { MOCK_CATEGORIES, MOCK_EXPENSE_CATEGORIES, MOCK_INCOME_CATEGORIES } from '@/mocks';

// Actions
import { createCategory, updateCategory } from '@/actions';

// Components
import { CategoryForm } from '@/components/CategoryForm';

jest.mock('@/actions', () => ({
  ...jest.requireActual('@/actions'),
  createCategory: jest.fn(),
  updateCategory: jest.fn(),
}));

jest.mock('@/hooks', () => ({
  ...jest.requireActual('@/hooks'),
  useToast: jest.fn(() => ({ showToast: jest.fn() })),
}));
const defaultProps = {
  userId: 'user-1',
  expenseCategories: MOCK_EXPENSE_CATEGORIES,
  incomeCategories: MOCK_INCOME_CATEGORIES,
  onSubmit: jest.fn(),
};

describe('CategoryForm', () => {
  it('renders with default props', () => {
    const { container } = render(<CategoryForm {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('renders Category Name input', () => {
    render(<CategoryForm {...defaultProps} />);
    expect(screen.getByPlaceholderText('e.g. Restaurant, Coffee')).toBeInTheDocument();
  });

  it('renders Expense and Income type buttons', () => {
    render(<CategoryForm {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Expense' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Income' })).toBeInTheDocument();
  });

  it('renders Submit button in create mode', () => {
    render(<CategoryForm {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('renders Save button in edit mode', () => {
    render(<CategoryForm {...defaultProps} previewData={MOCK_CATEGORIES[0]} />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('pre-fills name in edit mode', () => {
    render(<CategoryForm {...defaultProps} previewData={MOCK_CATEGORIES[0]} />);
    expect(screen.getByDisplayValue(MOCK_CATEGORIES[0].name)).toBeInTheDocument();
  });

  it('submit button is disabled when name is empty', () => {
    render(<CategoryForm {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('submit button is enabled after filling name', () => {
    render(<CategoryForm {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Restaurant, Coffee'), {
      target: { value: 'My Category' },
    });
    expect(screen.getByRole('button', { name: 'Submit' })).not.toBeDisabled();
  });

  it('type buttons are disabled in edit mode', () => {
    render(<CategoryForm {...defaultProps} previewData={MOCK_CATEGORIES[0]} />);
    expect(screen.getByRole('button', { name: 'Expense' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Income' })).toBeDisabled();
  });

  it('switches to Income type when Income button is clicked', () => {
    render(<CategoryForm {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Income' }));
    expect(screen.getByRole('button', { name: 'Income' })).toHaveClass('text-lime-700');
  });

  it('renders expense parent category options in dropdown', () => {
    render(<CategoryForm {...defaultProps} />);
    const label = screen.getByText('Parent Category (optional)');
    fireEvent.click(label.nextElementSibling as HTMLElement);
    expect(screen.getByText(MOCK_EXPENSE_CATEGORIES[0].name)).toBeInTheDocument();
  });

  it('selects a parent category from dropdown', () => {
    render(<CategoryForm {...defaultProps} />);
    const label = screen.getByText('Parent Category (optional)');
    fireEvent.click(label.nextElementSibling as HTMLElement);
    fireEvent.click(screen.getByText(MOCK_EXPENSE_CATEGORIES[0].name));
    expect(screen.queryByText(MOCK_EXPENSE_CATEGORIES[0].name)).toBeInTheDocument();
  });

  it('renders income parent category options after switching to Income type', () => {
    render(<CategoryForm {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Income' }));
    const label = screen.getByText('Parent Category (optional)');
    fireEvent.click(label.nextElementSibling as HTMLElement);
    expect(screen.getByText(MOCK_INCOME_CATEGORIES[0].name)).toBeInTheDocument();
  });

  it('calls createCategory on submit in create mode', async () => {
    (createCategory as jest.Mock).mockResolvedValue(undefined);
    render(<CategoryForm {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Restaurant, Coffee'), {
      target: { value: 'My Category' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(createCategory).toHaveBeenCalled();
    });
  });

  it('shows error toast when createCategory fails', async () => {
    (createCategory as jest.Mock).mockResolvedValue('Something went wrong');
    render(<CategoryForm {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Restaurant, Coffee'), {
      target: { value: 'My Category' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(createCategory).toHaveBeenCalled();
    });
  });

  it('calls updateCategory on submit in edit mode', async () => {
    (updateCategory as jest.Mock).mockResolvedValue(undefined);
    render(<CategoryForm {...defaultProps} previewData={MOCK_CATEGORIES[0]} />);
    fireEvent.change(screen.getByDisplayValue(MOCK_CATEGORIES[0].name), {
      target: { value: 'Updated Category' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(updateCategory).toHaveBeenCalled();
    });
  });
});
