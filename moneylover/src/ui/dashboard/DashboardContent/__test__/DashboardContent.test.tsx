import { render, waitFor } from '@testing-library/react';

// Mocks
import { MOCK_WALLETS, MOCK_EXPENSE_CATEGORIES, MOCK_INCOME_CATEGORIES } from '@/mocks';

// Services
import { getWalletsInfo, getCategoriesInfo } from '@/services';

// Configs
import { auth } from '@/configs/auth';

// UI
import { DashboardContent } from '../index';

jest.mock('@/services', () => ({
  ...jest.requireActual('@/services'),
  getWalletsInfo: jest.fn(),
  getCategoriesInfo: jest.fn(),
}));

jest.mock('@/layouts', () => ({
  Header: () => <div data-testid="header" />,
}));

const mockRedirect = jest.fn();
jest.mock('next/navigation', () => ({
  redirect: (url: string) => mockRedirect(url),
}));

describe('DashboardContent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render Header and children with data and match snapshot', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'user-1' } });
    (getWalletsInfo as jest.Mock).mockResolvedValue({
      wallets: MOCK_WALLETS,
      totalBalance: 6000200,
      currency: 'VND',
    });
    (getCategoriesInfo as jest.Mock).mockResolvedValue({
      expenseCategories: MOCK_EXPENSE_CATEGORIES,
      incomeCategories: MOCK_INCOME_CATEGORIES,
      subCategories: [],
    });

    const { container } = render(await DashboardContent({ children: <div>page content</div> }));

    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('should redirect to onboarding when no wallets', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'user-1' } });
    (getWalletsInfo as jest.Mock).mockResolvedValue({
      wallets: [],
      totalBalance: 0,
      currency: 'VND',
    });
    (getCategoriesInfo as jest.Mock).mockResolvedValue({
      expenseCategories: [],
      incomeCategories: [],
      subCategories: [],
    });

    await DashboardContent({ children: <div>page content</div> });

    expect(mockRedirect).toHaveBeenCalledWith('/onboarding');
  });
});
