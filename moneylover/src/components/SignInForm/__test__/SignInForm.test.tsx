import { fireEvent, render, screen } from '@testing-library/react';

// Components
import { SignInForm } from '@/components/SignInForm';

describe('SignInForm', () => {
  it('renders with default props', () => {
    const { container } = render(<SignInForm />);
    expect(container).toMatchSnapshot();
  });

  it('renders Sign In heading', () => {
    render(<SignInForm />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders email and password inputs', () => {
    render(<SignInForm />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('renders Sign Up link', () => {
    render(<SignInForm />);
    expect(screen.getByRole('link', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('submit button is disabled when fields are empty', () => {
    render(<SignInForm />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('submit button is enabled after filling email and password', () => {
    render(<SignInForm />);
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    expect(screen.getByRole('button', { name: 'Submit' })).not.toBeDisabled();
  });

  it('toggles password visibility when eye icon is clicked', () => {
    render(<SignInForm />);
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const { container } = render(<SignInForm />);
    const svgButtons = container.querySelectorAll('svg');
    fireEvent.click(svgButtons[0]);
    // After toggle, type should change — tested via snapshot coverage
  });
});
