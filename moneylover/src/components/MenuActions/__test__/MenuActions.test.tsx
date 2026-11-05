import { fireEvent, render, screen } from '@testing-library/react';

// Components
import { MenuActions } from '@/components/MenuActions';

describe('MenuActions', () => {
  it('renders with default props', () => {
    const { container } = render(<MenuActions />);
    expect(container).toMatchSnapshot();
  });

  it('renders toggle button', () => {
    render(<MenuActions />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not show Edit/Delete by default', () => {
    render(<MenuActions />);
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('shows Edit and Delete after toggle is clicked', () => {
    render(<MenuActions />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls onEdit when Edit is clicked', () => {
    const handleEdit = jest.fn();
    render(<MenuActions onEdit={handleEdit} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Edit'));
    expect(handleEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when Delete is clicked', () => {
    const handleDelete = jest.fn();
    render(<MenuActions onDelete={handleDelete} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Delete'));
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  it('closes dropdown after Edit is clicked', () => {
    render(<MenuActions onEdit={jest.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('closes dropdown after Delete is clicked', () => {
    render(<MenuActions onDelete={jest.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });
});
