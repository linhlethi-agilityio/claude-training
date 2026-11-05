import { render } from '@testing-library/react';

// Components
import {
  CategorySkeleton,
  HomeSkeleton,
  OnboardingSkeleton,
  TransactionSkeleton,
  WalletSelectorSkeleton,
} from '@/components/Skeleton';

describe('Skeleton', () => {
  it('renders CategorySkeleton', () => {
    const { container } = render(<CategorySkeleton />);
    expect(container).toMatchSnapshot();
  });

  it('renders HomeSkeleton', () => {
    const { container } = render(<HomeSkeleton />);
    expect(container).toMatchSnapshot();
  });

  it('renders OnboardingSkeleton', () => {
    const { container } = render(<OnboardingSkeleton />);
    expect(container).toMatchSnapshot();
  });

  it('renders TransactionSkeleton', () => {
    const { container } = render(<TransactionSkeleton />);
    expect(container).toMatchSnapshot();
  });

  it('renders WalletSelectorSkeleton', () => {
    const { container } = render(<WalletSelectorSkeleton />);
    expect(container).toMatchSnapshot();
  });
});
