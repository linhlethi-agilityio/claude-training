import { fireEvent, render, screen } from '@testing-library/react';

// Components
import { Toast } from '@/components/Toast';

const defaultProps = {
  id: 'toast-1',
  title: 'Success',
  status: 'success' as const,
  onClose: jest.fn(),
};

describe('Toast', () => {
  it('renders with default props', () => {
    const { container } = render(<Toast {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('renders title', () => {
    render(<Toast {...defaultProps} />);
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<Toast {...defaultProps} description="Operation completed" />);
    expect(screen.getByText('Operation completed')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<Toast {...defaultProps} />);
    expect(screen.queryByText('Operation completed')).not.toBeInTheDocument();
  });

  it('applies success styles', () => {
    const { container } = render(<Toast {...defaultProps} status="success" />);
    expect(container.firstChild).toHaveClass('border-green-500');
  });

  it('applies error styles', () => {
    const { container } = render(<Toast {...defaultProps} status="error" title="Error" />);
    expect(container.firstChild).toHaveClass('border-red-500');
  });

  it('applies info styles', () => {
    const { container } = render(<Toast {...defaultProps} status="info" title="Info" />);
    expect(container.firstChild).toHaveClass('border-blue-500');
  });

  it('calls onClose with id when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<Toast {...defaultProps} onClose={handleClose} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClose).toHaveBeenCalledWith('toast-1');
  });
});
