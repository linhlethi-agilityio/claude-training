// Mocks
import { MOCK_WALLETS } from '@/mocks';

// Libs
import { getWallets, addWallet, editWallet, removeWallet } from '@/libs/wallets';

jest.mock('@/libs/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
  },
}));

const getSupabase = () => jest.requireMock('@/libs/supabase').supabase;

beforeEach(() => {
  jest.clearAllMocks();
  const s = getSupabase();
  ['from', 'select', 'insert', 'update', 'delete', 'eq'].forEach((method) =>
    s[method].mockReturnThis(),
  );
  s.single.mockResolvedValue({ data: null, error: null });
});

describe('getWallets', () => {
  it('returns wallets on success', async () => {
    getSupabase().eq.mockResolvedValueOnce({ data: MOCK_WALLETS });
    const result = await getWallets('user-1');
    expect(result).toEqual(MOCK_WALLETS);
  });

  it('returns empty array when data is null', async () => {
    getSupabase().eq.mockResolvedValueOnce({ data: null });
    const result = await getWallets('user-1');
    expect(result).toEqual([]);
  });

  it('queries with userId', async () => {
    getSupabase().eq.mockResolvedValueOnce({ data: [] });
    await getWallets('user-1');
    expect(getSupabase().from).toHaveBeenCalledWith('wallets');
    expect(getSupabase().eq).toHaveBeenCalledWith('user_id', 'user-1');
  });
});

describe('addWallet', () => {
  it('returns no error on success', async () => {
    getSupabase().single.mockResolvedValueOnce({ data: { id: 'wallet-1' }, error: null });
    const result = await addWallet({
      user_id: 'user-1',
      name: 'Cash',
      currency: 'VND',
      balance: 0,
    });
    expect(result.error).toBeNull();
  });

  it('returns error on failure', async () => {
    getSupabase().single.mockResolvedValueOnce({ data: null, error: 'DB error' });
    const result = await addWallet({
      user_id: 'user-1',
      name: 'Cash',
      currency: 'VND',
      balance: 0,
    });
    expect(result.error).toBe('DB error');
  });

  it('inserts with correct fields', async () => {
    getSupabase().single.mockResolvedValueOnce({ data: { id: 'wallet-1' }, error: null });
    await addWallet({ user_id: 'user-1', name: 'Cash', currency: 'VND', balance: 100000 });
    expect(getSupabase().insert).toHaveBeenCalledWith({
      user_id: 'user-1',
      name: 'Cash',
      currency: 'VND',
      balance: 100000,
    });
  });
});

describe('editWallet', () => {
  it('returns no error on success', async () => {
    getSupabase().eq.mockResolvedValueOnce({ error: null });
    const result = await editWallet({ id: '1', name: 'Updated', currency: 'VND', balance: 500000 });
    expect(result.error).toBeNull();
  });

  it('returns error on failure', async () => {
    getSupabase().eq.mockResolvedValueOnce({ error: 'DB error' });
    const result = await editWallet({ id: '1', name: 'Updated', currency: 'VND' });
    expect(result.error).toBe('DB error');
  });
});

describe('removeWallet', () => {
  it('returns no error on success', async () => {
    getSupabase().eq.mockResolvedValueOnce({ error: null });
    const result = await removeWallet('wallet-1');
    expect(result.error).toBeNull();
  });

  it('calls delete with correct id', async () => {
    getSupabase().eq.mockResolvedValueOnce({ error: null });
    await removeWallet('wallet-1');
    expect(getSupabase().from).toHaveBeenCalledWith('wallets');
    expect(getSupabase().eq).toHaveBeenCalledWith('id', 'wallet-1');
  });
});
