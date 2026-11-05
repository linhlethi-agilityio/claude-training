// Mocks
import { MOCK_TRANSACTIONS_WITH_CATEGORY } from '@/mocks';

// Libs
import {
  getTransactions,
  getRecentTransactions,
  getTransactionById,
  removeTransaction,
  getTransactionBalanceByDate,
  addTransaction,
  editTransaction,
} from '@/libs/transactions';

jest.mock('@/libs/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    rpc: jest.fn().mockReturnThis(),
  },
}));

const getSupabase = () => jest.requireMock('@/libs/supabase').supabase;

beforeEach(() => {
  jest.clearAllMocks();
  // Restore chain after clearAllMocks resets mockReturnThis
  const s = getSupabase();
  [
    'from',
    'select',
    'insert',
    'update',
    'delete',
    'eq',
    'gte',
    'lte',
    'order',
    'limit',
    'ilike',
    'single',
  ].forEach((method) => s[method].mockReturnThis());
});

describe('getTransactions', () => {
  it('returns transactions when no query', async () => {
    getSupabase().order.mockResolvedValueOnce({ data: MOCK_TRANSACTIONS_WITH_CATEGORY });
    const result = await getTransactions('user-1', '2024-03-01', '2024-03-31');
    expect(result).toEqual(MOCK_TRANSACTIONS_WITH_CATEGORY);
  });

  it('returns empty array when data is null', async () => {
    getSupabase().order.mockResolvedValueOnce({ data: null });
    const result = await getTransactions('user-1', '2024-03-01', '2024-03-31');
    expect(result).toEqual([]);
  });

  it('queries correct table with userId and date range', async () => {
    getSupabase().order.mockResolvedValueOnce({ data: [] });
    await getTransactions('user-1', '2024-03-01', '2024-03-31');
    expect(getSupabase().from).toHaveBeenCalledWith('transactions');
    expect(getSupabase().eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(getSupabase().gte).toHaveBeenCalledWith('date', '2024-03-01');
    expect(getSupabase().lte).toHaveBeenCalledWith('date', '2024-03-31');
  });

  it('applies ilike filter when query is provided', async () => {
    getSupabase().ilike.mockResolvedValueOnce({ data: [] });
    await getTransactions('user-1', '2024-03-01', '2024-03-31', 'food');
    expect(getSupabase().ilike).toHaveBeenCalledWith('categories.name', '%food%');
  });

  it('filters by walletId when provided', async () => {
    // eq is called last in the chain for walletId case — resolve at that point
    getSupabase()
      .eq.mockReturnValueOnce(getSupabase()) // eq('user_id', ...) → chain
      .mockResolvedValueOnce({ data: [] }); // eq('wallet_id', ...) → resolve
    await getTransactions('user-1', '2024-03-01', '2024-03-31', undefined, 'wallet-1');
    expect(getSupabase().eq).toHaveBeenCalledWith('wallet_id', 'wallet-1');
  });
});

describe('getRecentTransactions', () => {
  it('returns recent transactions', async () => {
    getSupabase().limit.mockResolvedValueOnce({ data: MOCK_TRANSACTIONS_WITH_CATEGORY });
    const result = await getRecentTransactions('user-1', 5);
    expect(result).toEqual(MOCK_TRANSACTIONS_WITH_CATEGORY);
  });

  it('returns empty array when data is null', async () => {
    getSupabase().limit.mockResolvedValueOnce({ data: null });
    const result = await getRecentTransactions('user-1', 5);
    expect(result).toEqual([]);
  });

  it('applies limit', async () => {
    getSupabase().limit.mockResolvedValueOnce({ data: [] });
    await getRecentTransactions('user-1', 3);
    expect(getSupabase().limit).toHaveBeenCalledWith(3);
  });
});

describe('getTransactionById', () => {
  it('returns transaction data', async () => {
    getSupabase().single.mockResolvedValueOnce({ data: MOCK_TRANSACTIONS_WITH_CATEGORY[0] });
    const result = await getTransactionById('txn-1');
    expect(result).toEqual(MOCK_TRANSACTIONS_WITH_CATEGORY[0]);
  });

  it('queries with correct id', async () => {
    getSupabase().single.mockResolvedValueOnce({ data: null });
    await getTransactionById('txn-1');
    expect(getSupabase().eq).toHaveBeenCalledWith('id', 'txn-1');
  });
});

describe('removeTransaction', () => {
  it('returns no error on success', async () => {
    getSupabase().eq.mockResolvedValueOnce({ error: null });
    const result = await removeTransaction('txn-1');
    expect(result.error).toBeNull();
  });

  it('calls delete with correct id', async () => {
    getSupabase().eq.mockResolvedValueOnce({ error: null });
    await removeTransaction('txn-1');
    expect(getSupabase().from).toHaveBeenCalledWith('transactions');
    expect(getSupabase().eq).toHaveBeenCalledWith('id', 'txn-1');
  });
});

describe('getTransactionBalanceByDate', () => {
  it('returns inflow and outflow', async () => {
    getSupabase().rpc.mockResolvedValueOnce({ data: [{ inflow: 5000000, outflow: 200000 }] });
    const result = await getTransactionBalanceByDate('user-1', '2024-03-01', '2024-03-31');
    expect(result.inflow).toBe(5000000);
    expect(result.outflow).toBe(200000);
  });

  it('returns 0 for inflow and outflow when data is null', async () => {
    getSupabase().rpc.mockResolvedValueOnce({ data: null });
    const result = await getTransactionBalanceByDate('user-1', '2024-03-01', '2024-03-31');
    expect(result.inflow).toBe(0);
    expect(result.outflow).toBe(0);
  });

  it('calls rpc with correct params', async () => {
    getSupabase().rpc.mockResolvedValueOnce({ data: [] });
    await getTransactionBalanceByDate('user-1', '2024-03-01', '2024-03-31');
    expect(getSupabase().rpc).toHaveBeenCalledWith('get_transaction_summary', {
      user_id_input: 'user-1',
      start_date: '2024-03-01',
      end_date: '2024-03-31',
    });
  });
});

describe('addTransaction', () => {
  it('returns no error on success', async () => {
    getSupabase().insert.mockResolvedValueOnce({ error: null });
    const result = await addTransaction({ user_id: 'user-1', amount: 100000 });
    expect(result.error).toBeNull();
  });

  it('returns error on failure', async () => {
    getSupabase().insert.mockResolvedValueOnce({ error: 'DB error' });
    const result = await addTransaction({ user_id: 'user-1', amount: 100000 });
    expect(result.error).toBe('DB error');
  });
});

describe('editTransaction', () => {
  it('returns no error on success', async () => {
    getSupabase().eq.mockResolvedValueOnce({ error: null });
    const result = await editTransaction('txn-1', { amount: 200000 });
    expect(result.error).toBeNull();
  });

  it('calls update with correct id', async () => {
    getSupabase().eq.mockResolvedValueOnce({ error: null });
    await editTransaction('txn-1', { amount: 200000 });
    expect(getSupabase().from).toHaveBeenCalledWith('transactions');
    expect(getSupabase().eq).toHaveBeenCalledWith('id', 'txn-1');
  });
});
