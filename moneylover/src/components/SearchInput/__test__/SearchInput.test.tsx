import { render, screen } from '@testing-library/react';

// Components
import { SearchInput } from '@/components/SearchInput';

describe('SearchInput', () => {
  it('renders with default props', () => {
    const { container } = render(<SearchInput />);
    expect(container).toMatchSnapshot();
  });

  it('renders default placeholder', () => {
    render(<SearchInput />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    render(<SearchInput placeholder="Search transactions..." />);
    expect(screen.getByPlaceholderText('Search transactions...')).toBeInTheDocument();
  });

  it('renders search icon', () => {
    const { container } = render(<SearchInput />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
