import { render, waitFor } from '@testing-library/react';

// Mocks
import { MOCK_WALLETS, MOCK_TRANSACTIONS_WITH_CATEGORY } from '@/mocks';

// Services
import { getWalletsInfo, getRecentTransactionsList } from '@/services';

// Configs
import { auth } from '@/configs/auth';

// UI
import { HomeContent } from '../index';

jest.mock('@/services', () => ({
  ...jest.requireActual('@/services'),
  getWalletsInfo: jest.fn(),
  getRecentTransactionsList: jest.fn(),
}));

describe('HomeContent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render RecentTransactions with data and match snapshot', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'user-1' } });
    (getWalletsInfo as jest.Mock).mockResolvedValue({
      wallets: MOCK_WALLETS,
      totalBalance: 6000200,
      currency: 'VND',
    });
    (getRecentTransactionsList as jest.Mock).mockResolvedValue(MOCK_TRANSACTIONS_WITH_CATEGORY);

    const { container } = render(await HomeContent());

    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('should render RecentTransactions with empty data and match snapshot', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'user-1' } });
    (getWalletsInfo as jest.Mock).mockResolvedValue({
      wallets: [],
      totalBalance: 0,
      currency: 'VND',
    });
    (getRecentTransactionsList as jest.Mock).mockResolvedValue([]);

    const { container } = render(await HomeContent());

    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });
});
