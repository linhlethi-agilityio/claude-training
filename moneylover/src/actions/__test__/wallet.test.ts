'use server';

// Constants
import { CACHE_TAGS, ERROR_MESSAGES } from '@/constants';

import { updateTag } from 'next/cache';

// Configs
import { auth } from '@/configs/auth';

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

// Lets a test call an action with extra arguments, like a tampered client request would.
const callUntyped = (fn: unknown, ...args: unknown[]) =>
  (fn as (...a: unknown[]) => Promise<unknown>)(...args);

beforeEach(() => {
  jest.clearAllMocks();
  (auth as jest.Mock).mockResolvedValue({ user: { id: 'user-1' } });
});

describe('createWallet', () => {
  afterEach(() => {
    mockSupabase.from.mockReturnThis();
    mockSupabase.select.mockReturnThis();
    mockSupabase.insert.mockReturnThis();
    mockSupabase.eq.mockReturnThis();
    mockSupabase.ilike.mockReturnThis();
    mockSupabase.single.mockResolvedValue({ data: null, error: null });
  });

  it('should insert wallet for the session user and call updateTag on success', async () => {
    mockSupabase.single.mockResolvedValueOnce({ data: { id: 'wallet-1' }, error: null });

    await createWallet({ name: 'Cash', currency: 'VND', balance: 0 });

    expect(mockSupabase.from).toHaveBeenCalledWith('wallets');
    expect(mockSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-1', name: 'Cash', currency: 'VND' }),
    );
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.WALLETS}/user-1`);
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.TRANSACTIONS}/user-1`);
  });

  it('should ignore a userId sent by the client', async () => {
    mockSupabase.single.mockResolvedValueOnce({ data: { id: 'wallet-1' }, error: null });

    await callUntyped(createWallet, { userId: 'user-2', name: 'Cash', currency: 'VND' });

    expect(mockSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-1' }),
    );
  });

  it('should return the generic error without a session', async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const result = await createWallet({ name: 'Cash', currency: 'VND' });

    expect(result).toBe(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    expect(mockSupabase.insert).not.toHaveBeenCalled();
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('should default balance to 0 when not provided', async () => {
    mockSupabase.single.mockResolvedValueOnce({ data: { id: 'wallet-1' }, error: null });

    await createWallet({ name: 'Cash', currency: 'VND' });

    expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({ balance: 0 }));
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.WALLETS}/user-1`);
  });

  it('should return error message when supabase insert fails', async () => {
    mockSupabase.single.mockResolvedValueOnce({ data: null, error: { message: 'Insert failed' } });

    const result = await createWallet({ name: 'Cash', currency: 'VND' });

    expect(result).toBe('Insert failed');
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('should create initial balance transaction when balance > 0 and category found', async () => {
    mockSupabase.single
      .mockResolvedValueOnce({ data: { id: 'wallet-1' }, error: null })
      .mockResolvedValueOnce({ data: { id: 'cat-1' }, error: null });
    (addTransaction as jest.Mock).mockResolvedValue({ error: null });

    await createWallet({ name: 'Cash', currency: 'VND', balance: 100000 });

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
  it('should call editWallet with the session user and updateTag on success', async () => {
    (editWallet as jest.Mock).mockResolvedValue({ error: null, found: true });

    await updateWallet({ id: '1', name: 'Bank', currency: 'VND', balance: 500000 });

    expect(editWallet).toHaveBeenCalledWith({
      id: '1',
      user_id: 'user-1',
      name: 'Bank',
      currency: 'VND',
      balance: 500000,
    });
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.WALLETS}/user-1`);
  });

  it('should ignore a user_id sent by the client', async () => {
    (editWallet as jest.Mock).mockResolvedValue({ error: null, found: true });

    await callUntyped(updateWallet, { id: '1', user_id: 'user-2', name: 'Bank', currency: 'VND' });

    expect(editWallet).toHaveBeenCalledWith(expect.objectContaining({ user_id: 'user-1' }));
  });

  it("should return the generic error for another user's wallet", async () => {
    (editWallet as jest.Mock).mockResolvedValue({ error: null, found: false });

    const result = await updateWallet({ id: 'other', name: 'Bank', currency: 'VND' });

    expect(result).toBe(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('should return the generic error without a session', async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const result = await updateWallet({ id: '1', name: 'Bank', currency: 'VND' });

    expect(result).toBe(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    expect(editWallet).not.toHaveBeenCalled();
  });

  it('should return error message when editWallet fails', async () => {
    (editWallet as jest.Mock).mockResolvedValue({
      error: { message: 'Update failed' },
      found: false,
    });

    const result = await updateWallet({ id: '1', name: 'Bank', currency: 'VND' });

    expect(result).toBe('Update failed');
    expect(updateTag).not.toHaveBeenCalled();
  });
});

describe('deleteWallet', () => {
  it('should call removeWallet with the session user and updateTag on success', async () => {
    (removeWallet as jest.Mock).mockResolvedValue({ error: null, found: true });

    await deleteWallet('1');

    expect(removeWallet).toHaveBeenCalledWith('1', 'user-1');
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.WALLETS}/user-1`);
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.TRANSACTIONS}/user-1`);
  });

  it('should ignore a userId sent by the client', async () => {
    (removeWallet as jest.Mock).mockResolvedValue({ error: null, found: true });

    await callUntyped(deleteWallet, '1', 'user-2');

    expect(removeWallet).toHaveBeenCalledWith('1', 'user-1');
  });

  it("should return the generic error for another user's wallet", async () => {
    (removeWallet as jest.Mock).mockResolvedValue({ error: null, found: false });

    const result = await deleteWallet('other');

    expect(result).toBe(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('should return the generic error without a session', async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const result = await deleteWallet('1');

    expect(result).toBe(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    expect(removeWallet).not.toHaveBeenCalled();
  });

  it('should return error message when removeWallet fails', async () => {
    (removeWallet as jest.Mock).mockResolvedValue({
      error: { message: 'Delete failed' },
      found: false,
    });

    const result = await deleteWallet('1');

    expect(result).toBe('Delete failed');
    expect(updateTag).not.toHaveBeenCalled();
  });
});
