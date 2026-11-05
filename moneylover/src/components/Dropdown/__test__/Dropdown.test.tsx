import { fireEvent, render, screen } from '@testing-library/react';

// Components
import { Dropdown } from '@/components/Dropdown';

const items = [
  { id: '1', label: 'Cash' },
  { id: '2', label: 'Bank Account' },
  { id: '3', label: 'Savings' },
];

describe('Dropdown', () => {
  it('renders with default props', () => {
    const { container } = render(<Dropdown items={items} />);
    expect(container).toMatchSnapshot();
  });

  it('renders label when provided', () => {
    render(<Dropdown items={items} label="Wallet" />);
    expect(screen.getByText('Wallet')).toBeInTheDocument();
  });

  it('renders placeholder when no value selected', () => {
    render(<Dropdown items={items} placeholder="Select wallet" />);
    expect(screen.getByText('Select wallet')).toBeInTheDocument();
  });

  it('renders selected item label when value is set', () => {
    render(<Dropdown items={items} value="1" />);
    expect(screen.getByText('Cash')).toBeInTheDocument();
  });

  it('does not show options by default', () => {
    render(<Dropdown items={items} />);
    expect(screen.queryByText('Bank Account')).not.toBeInTheDocument();
  });

  it('shows options after toggle is clicked', () => {
    render(<Dropdown items={items} />);
    fireEvent.click(screen.getByText('Select an option...'));
    expect(screen.getByText('Cash')).toBeInTheDocument();
    expect(screen.getByText('Bank Account')).toBeInTheDocument();
  });

  it('calls onChange with selected item when option is clicked', () => {
    const handleChange = jest.fn();
    render(<Dropdown items={items} onChange={handleChange} />);
    fireEvent.click(screen.getByText('Select an option...'));
    fireEvent.click(screen.getByText('Cash'));
    expect(handleChange).toHaveBeenCalledWith(items[0]);
  });

  it('closes dropdown after selecting an item', () => {
    render(<Dropdown items={items} />);
    fireEvent.click(screen.getByText('Select an option...'));
    fireEvent.click(screen.getByText('Cash'));
    expect(screen.queryByText('Bank Account')).not.toBeInTheDocument();
  });
});
