'use server';

// Constants
import { CACHE_TAGS, ERROR_MESSAGES } from '@/constants';

// Types
import { FinanceType, TransactionFormData } from '@/types';

import { updateTag } from 'next/cache';

// Configs
import { auth } from '@/configs/auth';

// Actions
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  fetchTransactionDetail,
} from '../transaction';

// Libs
import { addTransaction, editTransaction, removeTransaction, getTransactionById } from '@/libs';

jest.mock('@/libs', () => ({
  addTransaction: jest.fn(),
  editTransaction: jest.fn(),
  removeTransaction: jest.fn(),
  getTransactionById: jest.fn(),
}));

// Lets a test call an action with extra arguments, like a tampered client request would.
const callUntyped = (fn: unknown, ...args: unknown[]) =>
  (fn as (...a: unknown[]) => Promise<unknown>)(...args);

const formData: TransactionFormData = {
  walletId: 'wallet-1',
  categoryId: 'cat-1',
  type: FinanceType.Expense,
  amount: 50000,
  date: '2026-04-01',
  note: 'Lunch',
};

beforeEach(() => {
  jest.clearAllMocks();
  (auth as jest.Mock).mockResolvedValue({ user: { id: 'user-1' } });
});

describe('createTransaction', () => {
  it('should call addTransaction with the session user and updateTag on success', async () => {
    (addTransaction as jest.Mock).mockResolvedValue({ error: null });

    await createTransaction(formData);

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

  it('should ignore a userId sent by the client', async () => {
    (addTransaction as jest.Mock).mockResolvedValue({ error: null });

    await callUntyped(createTransaction, { ...formData, userId: 'user-2' });

    expect(addTransaction).toHaveBeenCalledWith(expect.objectContaining({ user_id: 'user-1' }));
    expect(addTransaction).not.toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-2' }));
  });

  it('should return the generic error without a session', async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const result = await createTransaction(formData);

    expect(result).toBe(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    expect(addTransaction).not.toHaveBeenCalled();
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('should return error message when addTransaction fails', async () => {
    (addTransaction as jest.Mock).mockResolvedValue({ error: { message: 'Insert failed' } });

    const result = await createTransaction(formData);

    expect(result).toBe('Insert failed');
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('should reject a note longer than 255 characters without calling addTransaction', async () => {
    const result = await createTransaction({ ...formData, note: 'x'.repeat(256) });

    expect(result).toBe('Note must be at most 255 characters');
    expect(addTransaction).not.toHaveBeenCalled();
    expect(updateTag).not.toHaveBeenCalled();
  });
});

describe('updateTransaction', () => {
  it('should call editTransaction with the session user and updateTag on success', async () => {
    (editTransaction as jest.Mock).mockResolvedValue({ error: null, found: true });

    await updateTransaction('txn-1', formData);

    expect(editTransaction).toHaveBeenCalledWith('txn-1', 'user-1', {
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

  it("should return the generic error for another user's transaction", async () => {
    (editTransaction as jest.Mock).mockResolvedValue({ error: null, found: false });

    const result = await updateTransaction('txn-other', formData);

    expect(result).toBe(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('should return the generic error without a session', async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const result = await updateTransaction('txn-1', formData);

    expect(result).toBe(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    expect(editTransaction).not.toHaveBeenCalled();
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('should return error message when editTransaction fails', async () => {
    (editTransaction as jest.Mock).mockResolvedValue({
      error: { message: 'Update failed' },
      found: false,
    });

    const result = await updateTransaction('txn-1', formData);

    expect(result).toBe('Update failed');
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('should reject a note longer than 255 characters without calling editTransaction', async () => {
    const result = await updateTransaction('txn-1', { ...formData, note: 'x'.repeat(256) });

    expect(result).toBe('Note must be at most 255 characters');
    expect(editTransaction).not.toHaveBeenCalled();
    expect(updateTag).not.toHaveBeenCalled();
  });
});

describe('deleteTransaction', () => {
  it('should call removeTransaction with the session user and updateTag on success', async () => {
    (removeTransaction as jest.Mock).mockResolvedValue({ error: null, found: true });

    await deleteTransaction('txn-1');

    expect(removeTransaction).toHaveBeenCalledWith('txn-1', 'user-1');
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.TRANSACTIONS}/user-1`);
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.WALLETS}/user-1`);
  });

  it('should ignore a userId sent by the client', async () => {
    (removeTransaction as jest.Mock).mockResolvedValue({ error: null, found: true });

    await callUntyped(deleteTransaction, 'txn-1', 'user-2');

    expect(removeTransaction).toHaveBeenCalledWith('txn-1', 'user-1');
    expect(updateTag).not.toHaveBeenCalledWith(`${CACHE_TAGS.TRANSACTIONS}/user-2`);
  });

  it("should return the generic error for another user's transaction", async () => {
    (removeTransaction as jest.Mock).mockResolvedValue({ error: null, found: false });

    const result = await deleteTransaction('txn-other');

    expect(result).toBe(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('should return the generic error without a session', async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const result = await deleteTransaction('txn-1');

    expect(result).toBe(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    expect(removeTransaction).not.toHaveBeenCalled();
  });

  it('should return error message when removeTransaction fails', async () => {
    (removeTransaction as jest.Mock).mockResolvedValue({
      error: { message: 'Delete failed' },
      found: false,
    });

    const result = await deleteTransaction('txn-1');

    expect(result).toBe('Delete failed');
    expect(updateTag).not.toHaveBeenCalled();
  });
});

describe('fetchTransactionDetail', () => {
  it('should read the transaction for the session user', async () => {
    (getTransactionById as jest.Mock).mockResolvedValue({ id: 'txn-1' });

    const result = await fetchTransactionDetail('txn-1');

    expect(getTransactionById).toHaveBeenCalledWith('txn-1', 'user-1');
    expect(result).toEqual({ id: 'txn-1' });
  });

  it('should return null without a session', async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const result = await fetchTransactionDetail('txn-1');

    expect(result).toBeNull();
    expect(getTransactionById).not.toHaveBeenCalled();
  });
});
