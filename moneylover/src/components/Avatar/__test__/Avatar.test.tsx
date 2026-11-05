import { render } from '@testing-library/react';

// Components
import { Avatar } from '@/components/Avatar';

describe('Avatar', () => {
  it('renders with default props', () => {
    const { container } = render(<Avatar />);
    expect(container).toMatchSnapshot();
  });

  it('renders sm size', () => {
    const { container } = render(<Avatar size="sm" />);
    expect(container.firstChild).toHaveClass('h-8', 'w-8');
  });

  it('renders md size', () => {
    const { container } = render(<Avatar size="md" />);
    expect(container.firstChild).toHaveClass('h-10', 'w-10');
  });

  it('renders lg size', () => {
    const { container } = render(<Avatar size="lg" />);
    expect(container.firstChild).toHaveClass('h-14', 'w-14');
  });

  it('applies custom className', () => {
    const { container } = render(<Avatar className="border-2 border-red-500" />);
    expect(container.firstChild).toHaveClass('border-2', 'border-red-500');
  });
});
