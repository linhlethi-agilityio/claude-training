// Mocks
import { MOCK_TRANSACTIONS_WITH_CATEGORY } from '@/mocks';

// Services
import {
  getRecentTransactionsList,
  getTransactionDetailById,
  getTransactionsByDate,
} from '@/services/transactions';

jest.mock('@/libs', () => ({
  getRecentTransactions: jest.fn(),
  getTransactionById: jest.fn(),
  getTransactions: jest.fn(),
  getTransactionBalanceByDate: jest.fn(),
}));

const { getRecentTransactions, getTransactionById, getTransactions, getTransactionBalanceByDate } =
  jest.requireMock('@/libs');

describe('getRecentTransactionsList', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns recent transactions', async () => {
    getRecentTransactions.mockResolvedValue(MOCK_TRANSACTIONS_WITH_CATEGORY);
    const result = await getRecentTransactionsList('user-1');
    expect(result).toEqual(MOCK_TRANSACTIONS_WITH_CATEGORY);
  });

  it('calls getRecentTransactions with userId and default limit', async () => {
    getRecentTransactions.mockResolvedValue([]);
    await getRecentTransactionsList('user-1');
    expect(getRecentTransactions).toHaveBeenCalledWith('user-1', expect.any(Number));
  });

  it('calls getRecentTransactions with custom limit', async () => {
    getRecentTransactions.mockResolvedValue([]);
    await getRecentTransactionsList('user-1', 5);
    expect(getRecentTransactions).toHaveBeenCalledWith('user-1', 5);
  });
});

describe('getTransactionDetailById', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns transaction detail', async () => {
    getTransactionById.mockResolvedValue(MOCK_TRANSACTIONS_WITH_CATEGORY[0]);
    const result = await getTransactionDetailById('txn-1');
    expect(result).toEqual(MOCK_TRANSACTIONS_WITH_CATEGORY[0]);
  });

  it('calls getTransactionById with id', async () => {
    getTransactionById.mockResolvedValue(null);
    await getTransactionDetailById('txn-1');
    expect(getTransactionById).toHaveBeenCalledWith('txn-1');
  });
});

describe('getTransactionsByDate', () => {
  const mockBalance = { inflow: 5000000, outflow: 200000 };

  beforeEach(() => {
    getTransactions.mockResolvedValue(MOCK_TRANSACTIONS_WITH_CATEGORY);
    getTransactionBalanceByDate.mockResolvedValue(mockBalance);
  });

  afterEach(() => jest.clearAllMocks());

  it('returns transactions, inflow, outflow and groupedByCategory', async () => {
    const result = await getTransactionsByDate('user-1', '2024-03-01', '2024-03-31');
    expect(result.transactions).toEqual(MOCK_TRANSACTIONS_WITH_CATEGORY);
    expect(result.inflow).toBe(5000000);
    expect(result.outflow).toBe(200000);
    expect(result.groupedByCategory).toBeDefined();
  });

  it('groups transactions by category_id', async () => {
    const result = await getTransactionsByDate('user-1', '2024-03-01', '2024-03-31');
    Object.entries(result.groupedByCategory).forEach(([key, txns]) => {
      txns.forEach((t) => expect(t.category_id).toBe(key));
    });
  });

  it('calls getTransactions with all params', async () => {
    await getTransactionsByDate('user-1', '2024-03-01', '2024-03-31', 'food', 'wallet-1');
    expect(getTransactions).toHaveBeenCalledWith(
      'user-1',
      '2024-03-01',
      '2024-03-31',
      'food',
      'wallet-1',
    );
  });

  it('returns empty groupedByCategory when no transactions', async () => {
    getTransactions.mockResolvedValue([]);
    const result = await getTransactionsByDate('user-1', '2024-03-01', '2024-03-31');
    expect(result.groupedByCategory).toEqual({});
  });
});
