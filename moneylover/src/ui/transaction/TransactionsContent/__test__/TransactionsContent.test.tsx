import { render, waitFor } from '@testing-library/react';

// Services
import { getCategoriesInfo, getTransactionsByDate, getWalletsInfo } from '@/services';

// Configs
import { auth } from '@/configs/auth';

// UI
import { TransactionsContent } from '../index';

// Mocks
import {
  MOCK_WALLETS,
  MOCK_EXPENSE_CATEGORIES,
  MOCK_INCOME_CATEGORIES,
  MOCK_GROUPED_BY_CATEGORY,
} from '@/mocks';

jest.mock('@/services', () => ({
  ...jest.requireActual('@/services'),
  getCategoriesInfo: jest.fn(),
  getTransactionsByDate: jest.fn(),
  getWalletsInfo: jest.fn(),
}));

describe('TransactionsContent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render TransactionList with data and match snapshot', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'user-1' } });
    (getTransactionsByDate as jest.Mock).mockResolvedValue({
      inflow: 1000000,
      outflow: 500000,
      groupedByCategory: MOCK_GROUPED_BY_CATEGORY,
    });
    (getCategoriesInfo as jest.Mock).mockResolvedValue({
      expenseCategories: MOCK_EXPENSE_CATEGORIES,
      incomeCategories: MOCK_INCOME_CATEGORIES,
      subCategories: [],
    });
    (getWalletsInfo as jest.Mock).mockResolvedValue({
      wallets: MOCK_WALLETS,
      totalBalance: 6000200,
      currency: 'VND',
    });

    const { container } = render(await TransactionsContent({ period: 'this' }));

    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('should render TransactionList with empty data and match snapshot', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'user-1' } });
    (getTransactionsByDate as jest.Mock).mockResolvedValue({
      inflow: 0,
      outflow: 0,
      groupedByCategory: {},
    });
    (getCategoriesInfo as jest.Mock).mockResolvedValue({
      expenseCategories: [],
      incomeCategories: [],
      subCategories: [],
    });
    (getWalletsInfo as jest.Mock).mockResolvedValue({
      wallets: [],
      totalBalance: 0,
      currency: 'VND',
    });

    const { container } = render(
      await TransactionsContent({ period: 'this', query: 'coffee', walletId: '1' }),
    );

    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });
});
