import { fireEvent, render, screen } from '@testing-library/react';

// Mocks
import { MOCK_CATEGORIES, MOCK_SUB_CATEGORIES } from '@/mocks';

// Components
import { CategoryItem } from '@/components/CategoryItem';

const foodCategory = MOCK_CATEGORIES[0]; // Food & Beverage
const foodSubCategories = MOCK_SUB_CATEGORIES.filter((s) => s.parent_id === foodCategory.id);

describe('CategoryItem', () => {
  it('renders with default props', () => {
    const { container } = render(<CategoryItem category={foodCategory} />);
    expect(container).toMatchSnapshot();
  });

  it('renders category name', () => {
    render(<CategoryItem category={foodCategory} />);
    expect(screen.getByText('Food & Beverage')).toBeInTheDocument();
  });

  it('does not show subcategories by default', () => {
    render(<CategoryItem category={foodCategory} subCategories={foodSubCategories} />);
    expect(screen.queryByText('Restaurant')).not.toBeInTheDocument();
  });

  it('expands subcategories when clicked', () => {
    render(<CategoryItem category={foodCategory} subCategories={foodSubCategories} />);
    fireEvent.click(screen.getByText('Food & Beverage').closest('div')!);
    expect(screen.getByText('Restaurant')).toBeInTheDocument();
  });

  it('collapses subcategories on second click', () => {
    render(<CategoryItem category={foodCategory} subCategories={foodSubCategories} />);
    const row = screen.getByText('Food & Beverage').closest('div')!;
    fireEvent.click(row);
    fireEvent.click(row);
    expect(screen.queryByText('Restaurant')).not.toBeInTheDocument();
  });

  it('shows menu when category is not default', () => {
    render(<CategoryItem category={foodCategory} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onEdit with category when edit is clicked', () => {
    const handleEdit = jest.fn();
    render(<CategoryItem category={foodCategory} onEdit={handleEdit} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Edit'));
    expect(handleEdit).toHaveBeenCalledWith(foodCategory);
  });

  it('calls onDelete with id when delete is clicked', () => {
    const handleDelete = jest.fn();
    render(<CategoryItem category={foodCategory} onDelete={handleDelete} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Delete'));
    expect(handleDelete).toHaveBeenCalledWith(foodCategory.id);
  });

  it('calls onEdit with subcategory when subcategory edit is clicked', () => {
    const handleEdit = jest.fn();
    render(
      <CategoryItem
        category={foodCategory}
        subCategories={foodSubCategories}
        onEdit={handleEdit}
      />,
    );
    fireEvent.click(screen.getByText('Food & Beverage').closest('div')!);
    const menuButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(menuButtons[1]);
    fireEvent.click(screen.getAllByText('Edit')[0]);
    expect(handleEdit).toHaveBeenCalledWith(foodSubCategories[0]);
  });
});
