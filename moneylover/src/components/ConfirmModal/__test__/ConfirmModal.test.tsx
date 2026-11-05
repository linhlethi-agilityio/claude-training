import { fireEvent, render, screen } from '@testing-library/react';

// Components
import { ConfirmModal } from '@/components/ConfirmModal';

const defaultProps = {
  isOpen: true,
  title: 'Delete Item',
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
};

describe('ConfirmModal', () => {
  it('renders with default props', () => {
    const { container } = render(<ConfirmModal {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('renders title', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('Delete Item')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<ConfirmModal {...defaultProps} description="This action cannot be undone." />);
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.queryByText('This action cannot be undone.')).not.toBeInTheDocument();
  });

  it('renders default Confirm label', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('renders custom confirmLabel', () => {
    render(<ConfirmModal {...defaultProps} confirmLabel="Delete" />);
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('renders Cancel button', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const handleConfirm = jest.fn();
    render(<ConfirmModal {...defaultProps} onConfirm={handleConfirm} />);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when Cancel button is clicked', () => {
    const handleCancel = jest.fn();
    render(<ConfirmModal {...defaultProps} onCancel={handleCancel} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('does not render when isOpen is false', () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Delete Item')).not.toBeInTheDocument();
  });
});
