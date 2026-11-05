'use server';

// Constants
import { CACHE_TAGS } from '@/constants';

import { updateTag } from 'next/cache';

// Actions
import { createWallet, updateWallet, deleteWallet } from '../wallet';

// Libs
import { editWallet, removeWallet, addTransaction } from '@/libs';

jest.mock('@/libs', () => ({
  ...jest.requireMock('@/libs/supabase'),
  addWallet: jest.requireActual('@/libs/wallets').addWallet,
  editWallet: jest.fn(),
  removeWallet: jest.fn(),
  addTransaction: jest.fn(),
  getDefaultCategoryByType: jest.requireActual('@/libs/categories').getDefaultCategoryByType,
}));

const mockSupabase = jest.requireMock('@/libs/supabase').supabase as Record<string, jest.Mock>;

describe('createWallet', () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockSupabase.from.mockReturnThis();
    mockSupabase.select.mockReturnThis();
    mockSupabase.insert.mockReturnThis();
    mockSupabase.eq.mockReturnThis();
    mockSupabase.ilike.mockReturnThis();
    mockSupabase.single.mockResolvedValue({ data: null, error: null });
  });

  it('should insert wallet via supabase and call updateTag on success', async () => {
    mockSupabase.single.mockResolvedValueOnce({ data: { id: 'wallet-1' }, error: null });

    await createWallet({ userId: 'user-1', name: 'Cash', currency: 'VND', balance: 0 });

    expect(mockSupabase.from).toHaveBeenCalledWith('wallets');
    expect(mockSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-1', name: 'Cash', currency: 'VND' }),
    );
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.WALLETS}/user-1`);
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.TRANSACTIONS}/user-1`);
  });

  it('should default balance to 0 when not provided', async () => {
    mockSupabase.single.mockResolvedValueOnce({ data: { id: 'wallet-1' }, error: null });

    await createWallet({ userId: 'user-1', name: 'Cash', currency: 'VND' });

    expect(mockSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({ balance: 0 }),
    );
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.WALLETS}/user-1`);
  });

  it('should return error message when supabase insert fails', async () => {
    mockSupabase.single.mockResolvedValueOnce({ data: null, error: { message: 'Insert failed' } });

    const result = await createWallet({ userId: 'user-1', name: 'Cash', currency: 'VND' });

    expect(result).toBe('Insert failed');
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('should create initial balance transaction when balance > 0 and category found', async () => {
    mockSupabase.single
      .mockResolvedValueOnce({ data: { id: 'wallet-1' }, error: null })
      .mockResolvedValueOnce({ data: { id: 'cat-1' }, error: null });
    (addTransaction as jest.Mock).mockResolvedValue({ error: null });

    await createWallet({ userId: 'user-1', name: 'Cash', currency: 'VND', balance: 100000 });

    expect(addTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        wallet_id: 'wallet-1',
        category_id: 'cat-1',
        amount: 100000,
        note: 'Initial balance',
      }),
    );
  });
});

describe('updateWallet', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call editWallet and updateTag on success', async () => {
    (editWallet as jest.Mock).mockResolvedValue({ error: null });

    await updateWallet({ id: '1', user_id: 'user-1', name: 'Bank', currency: 'VND', balance: 500000 });

    expect(editWallet).toHaveBeenCalledWith({
      id: '1',
      name: 'Bank',
      currency: 'VND',
      balance: 500000,
    });
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.WALLETS}/user-1`);
  });

  it('should return error message when editWallet fails', async () => {
    (editWallet as jest.Mock).mockResolvedValue({ error: { message: 'Update failed' } });

    const result = await updateWallet({ id: '1', name: 'Bank', currency: 'VND' });

    expect(result).toBe('Update failed');
    expect(updateTag).not.toHaveBeenCalled();
  });
});

describe('deleteWallet', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call removeWallet and updateTag on success', async () => {
    (removeWallet as jest.Mock).mockResolvedValue({ error: null });

    await deleteWallet('1', 'user-1');

    expect(removeWallet).toHaveBeenCalledWith('1');
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.WALLETS}/user-1`);
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.TRANSACTIONS}/user-1`);
  });

  it('should return error message when removeWallet fails', async () => {
    (removeWallet as jest.Mock).mockResolvedValue({ error: { message: 'Delete failed' } });

    const result = await deleteWallet('1', 'user-1');

    expect(result).toBe('Delete failed');
    expect(updateTag).not.toHaveBeenCalled();
  });
});
