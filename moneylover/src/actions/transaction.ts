'use server';

import { updateTag } from 'next/cache';

// Constants
import { CACHE_TAGS } from '@/constants';

// Types
import { TransactionFormData } from '@/types';

// Libs
import { addTransaction, editTransaction, removeTransaction, getTransactionById } from '@/libs';

interface CreateTransactionParams extends TransactionFormData {
  userId: string;
  walletId: string;
}

export const createTransaction = async ({
  userId,
  walletId,
  categoryId,
  type,
  amount,
  date,
  note,
}: CreateTransactionParams): Promise<void | string> => {
  const { error } = await addTransaction({
    user_id: userId,
    wallet_id: walletId,
    category_id: categoryId,
    type,
    amount,
    date,
    note,
  });

  if (error) {
    return error.message;
  }

  updateTag(`${CACHE_TAGS.TRANSACTIONS}/${userId}`);
  updateTag(`${CACHE_TAGS.WALLETS}/${userId}`);
};

export const updateTransaction = async (
  id: string,
  userId: string,
  data: TransactionFormData,
): Promise<void | string> => {
  const { walletId, categoryId, type, amount, date, note } = data;
  const { error } = await editTransaction(id, {
    wallet_id: walletId,
    category_id: categoryId,
    type,
    amount,
    date,
    note,
  });

  if (error) {
    return error.message;
  }

  updateTag(`${CACHE_TAGS.TRANSACTIONS}/${userId}`);
  updateTag(`${CACHE_TAGS.TRANSACTION}/${id}`);
  updateTag(`${CACHE_TAGS.WALLETS}/${userId}`);
};

export const deleteTransaction = async (id: string, userId: string): Promise<void | string> => {
  const { error } = await removeTransaction(id);

  if (error) {
    return error.message;
  }

  updateTag(`${CACHE_TAGS.TRANSACTIONS}/${userId}`);
  updateTag(`${CACHE_TAGS.WALLETS}/${userId}`);
};

export const fetchTransactionDetail = async (id: string) => {
  return getTransactionById(id);
};
