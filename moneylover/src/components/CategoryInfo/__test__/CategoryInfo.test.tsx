import { render, screen } from '@testing-library/react';

// Components
import { CategoryInfo } from '@/components/CategoryInfo';

describe('CategoryInfo', () => {
  it('renders with default props', () => {
    const { container } = render(<CategoryInfo name="Food & Beverage" />);
    expect(container).toMatchSnapshot();
  });

  it('renders category name', () => {
    render(<CategoryInfo name="Food & Beverage" />);
    expect(screen.getByText('Food & Beverage')).toBeInTheDocument();
  });

  it('renders first letter avatar when no imageUrl', () => {
    render(<CategoryInfo name="Salary" />);
    expect(screen.getByText('S')).toBeInTheDocument();
  });

  it('renders image when imageUrl is provided', () => {
    render(<CategoryInfo name="Food" imageUrl="https://example.com/food.png" />);
    expect(screen.getByRole('img', { name: 'Food' })).toBeInTheDocument();
  });

  it('renders date when provided', () => {
    render(<CategoryInfo name="Food" date="2024-03-15" />);
    expect(screen.getByText(/March/i)).toBeInTheDocument();
  });

  it('does not render date when not provided', () => {
    render(<CategoryInfo name="Food" />);
    expect(screen.queryByText(/March/i)).not.toBeInTheDocument();
  });

  it('applies sm size classes', () => {
    const { container } = render(<CategoryInfo name="Food" size="sm" />);
    expect(container.querySelector('.h-8')).toBeInTheDocument();
  });

  it('applies md size classes by default', () => {
    const { container } = render(<CategoryInfo name="Food" />);
    expect(container.querySelector('.h-10')).toBeInTheDocument();
  });
});
