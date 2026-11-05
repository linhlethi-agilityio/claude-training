import { fireEvent, render, screen } from '@testing-library/react';

// Components
import { Input } from '@/components/Input';

describe('Input', () => {
  it('renders with default props', () => {
    const { container } = render(<Input />);
    expect(container).toMatchSnapshot();
  });

  it('renders label when provided', () => {
    render(<Input label="Email" id="email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('does not render label when not provided', () => {
    render(<Input placeholder="Email" />);
    expect(screen.queryByText('Email')).not.toBeInTheDocument();
  });

  it('renders placeholder', () => {
    render(<Input placeholder="Enter email" />);
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<Input errorMessage="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('does not render error message when not provided', () => {
    render(<Input />);
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
  });

  it('applies error border class when errorMessage provided', () => {
    render(<Input errorMessage="Error" />);
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
  });

  it('renders rightIcon when provided', () => {
    render(<Input rightIcon={<span data-testid="icon">icon</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is set', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
