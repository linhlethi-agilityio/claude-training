'use server';

// Constants
import { CACHE_TAGS } from '@/constants';

// Types
import { FinanceType } from '@/types';

import { updateTag } from 'next/cache';

// Actions
import { createTransaction, updateTransaction, deleteTransaction } from '../transaction';

// Libs
import { addTransaction, editTransaction, removeTransaction } from '@/libs';

jest.mock('@/libs', () => ({
  addTransaction: jest.fn(),
  editTransaction: jest.fn(),
  removeTransaction: jest.fn(),
}));

const defaultParams = {
  userId: 'user-1',
  walletId: 'wallet-1',
  categoryId: 'cat-1',
  type: FinanceType.Expense,
  amount: 50000,
  date: '2026-04-01',
  note: 'Lunch',
};

describe('createTransaction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call addTransaction and updateTag on success', async () => {
    (addTransaction as jest.Mock).mockResolvedValue({ error: null });

    await createTransaction(defaultParams);

    expect(addTransaction).toHaveBeenCalledWith({
      user_id: 'user-1',
      wallet_id: 'wallet-1',
      category_id: 'cat-1',
      type: FinanceType.Expense,
      amount: 50000,
      date: '2026-04-01',
      note: 'Lunch',
    });
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.TRANSACTIONS}/user-1`);
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.WALLETS}/user-1`);
  });

  it('should return error message when addTransaction fails', async () => {
    (addTransaction as jest.Mock).mockResolvedValue({ error: { message: 'Insert failed' } });

    const result = await createTransaction(defaultParams);

    expect(result).toBe('Insert failed');
    expect(updateTag).not.toHaveBeenCalled();
  });
});

describe('updateTransaction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const formData = {
    walletId: 'wallet-1',
    categoryId: 'cat-1',
    type: FinanceType.Expense,
    amount: 50000,
    date: '2026-04-01',
    note: 'Lunch',
  };

  it('should call editTransaction and updateTag on success', async () => {
    (editTransaction as jest.Mock).mockResolvedValue({ error: null });

    await updateTransaction('txn-1', 'user-1', formData);

    expect(editTransaction).toHaveBeenCalledWith('txn-1', {
      wallet_id: 'wallet-1',
      category_id: 'cat-1',
      type: FinanceType.Expense,
      amount: 50000,
      date: '2026-04-01',
      note: 'Lunch',
    });
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.TRANSACTIONS}/user-1`);
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.TRANSACTION}/txn-1`);
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.WALLETS}/user-1`);
  });

  it('should return error message when editTransaction fails', async () => {
    (editTransaction as jest.Mock).mockResolvedValue({ error: { message: 'Update failed' } });

    const result = await updateTransaction('txn-1', 'user-1', formData);

    expect(result).toBe('Update failed');
    expect(updateTag).not.toHaveBeenCalled();
  });
});

describe('deleteTransaction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call removeTransaction and updateTag on success', async () => {
    (removeTransaction as jest.Mock).mockResolvedValue({ error: null });

    await deleteTransaction('txn-1', 'user-1');

    expect(removeTransaction).toHaveBeenCalledWith('txn-1');
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.TRANSACTIONS}/user-1`);
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.WALLETS}/user-1`);
  });

  it('should return error message when removeTransaction fails', async () => {
    (removeTransaction as jest.Mock).mockResolvedValue({ error: { message: 'Delete failed' } });

    const result = await deleteTransaction('txn-1', 'user-1');

    expect(result).toBe('Delete failed');
    expect(updateTag).not.toHaveBeenCalled();
  });
});
