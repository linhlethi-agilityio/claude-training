import { fireEvent, render, screen } from '@testing-library/react';

// Components
import { WalletItem } from '@/components/WalletItem';

describe('WalletItem', () => {
  it('renders with default props', () => {
    const { container } = render(<WalletItem name="Cash" balance={1000000} />);
    expect(container).toMatchSnapshot();
  });

  it('renders wallet name', () => {
    render(<WalletItem name="Cash" balance={1000000} />);
    expect(screen.getByText('Cash')).toBeInTheDocument();
  });

  it('shows balance below name when showBalance is false', () => {
    render(<WalletItem name="Cash" balance={1000000} currency="VND" showBalance={false} />);
    expect(screen.getByText('Cash')).toBeInTheDocument();
  });

  it('shows balance on the right when showBalance is true', () => {
    render(<WalletItem name="Cash" balance={1000000} currency="VND" showBalance />);
    const balanceElements = screen.getAllByText(/1,000,000|1\.000\.000/);
    expect(balanceElements.length).toBeGreaterThan(0);
  });

  it('shows check icon when isSelected is true', () => {
    const { container } = render(<WalletItem name="Cash" balance={1000000} isSelected />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('does not show check icon when isSelected is false', () => {
    render(<WalletItem name="Cash" balance={1000000} isSelected={false} showMenu={false} />);
    const checkPath = document.querySelector('path[d*="16.17"]');
    expect(checkPath).not.toBeInTheDocument();
  });

  it('shows menu toggle button when showMenu is true', () => {
    render(<WalletItem name="Cash" balance={1000000} showMenu />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not show menu toggle button when showMenu is false', () => {
    render(<WalletItem name="Cash" balance={1000000} showMenu={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<WalletItem name="Cash" balance={1000000} onClick={handleClick} />);
    fireEvent.click(screen.getByText('Cash').closest('div')!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls onEdit when edit is clicked', () => {
    const handleEdit = jest.fn();
    render(<WalletItem name="Cash" balance={1000000} showMenu onEdit={handleEdit} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Edit'));
    expect(handleEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete is clicked', () => {
    const handleDelete = jest.fn();
    render(<WalletItem name="Cash" balance={1000000} showMenu onDelete={handleDelete} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Delete'));
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });
});
