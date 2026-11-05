import { fireEvent, render, screen } from '@testing-library/react';

// Components
import { SignUpForm } from '@/components/SignUpForm';

describe('SignUpForm', () => {
  it('renders with default props', () => {
    const { container } = render(<SignUpForm />);
    expect(container).toMatchSnapshot();
  });

  it('renders Sign Up heading', () => {
    render(<SignUpForm />);
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('renders email, password and confirm password inputs', () => {
    render(<SignUpForm />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
  });

  it('renders Sign In link', () => {
    render(<SignUpForm />);
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('submit button is disabled when fields are empty', () => {
    render(<SignUpForm />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('submit button is enabled after filling all required fields', () => {
    render(<SignUpForm />);
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password123' },
    });
    expect(screen.getByRole('button', { name: 'Submit' })).not.toBeDisabled();
  });

  it('password input type is password by default', () => {
    render(<SignUpForm />);
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
    expect(screen.getByPlaceholderText('Confirm Password')).toHaveAttribute('type', 'password');
  });
});
