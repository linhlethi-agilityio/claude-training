import { fireEvent, render, screen } from '@testing-library/react';

// Components
import { Modal } from '@/components/Modal';

const defaultProps = {
  isOpen: true,
  title: 'Test Modal',
  onClose: jest.fn(),
  children: <p>Modal content</p>,
};

describe('Modal', () => {
  it('renders with default props', () => {
    const { container } = render(<Modal {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('renders title', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<Modal {...defaultProps} onClose={handleClose} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
