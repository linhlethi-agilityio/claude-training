'use server';

import { updateTag } from 'next/cache';

// Constants
import { CACHE_TAGS, ERROR_MESSAGES, NOTE_MAX_LENGTH } from '@/constants';

// Types
import { TransactionFormData } from '@/types';

// Configs
import { auth } from '@/configs/auth';

// Libs
import { addTransaction, editTransaction, removeTransaction, getTransactionById } from '@/libs';

const validateNote = (note?: string): string | undefined =>
  note && note.length > NOTE_MAX_LENGTH ? ERROR_MESSAGES.NOTE_TOO_LONG(NOTE_MAX_LENGTH) : undefined;

export const createTransaction = async ({
  walletId,
  categoryId,
  type,
  amount,
  date,
  note,
}: TransactionFormData): Promise<void | string> => {
  const userId = (await auth())?.user?.id;
  if (!userId) {
    return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
  }

  const noteError = validateNote(note);
  if (noteError) {
    return noteError;
  }

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
  data: TransactionFormData,
): Promise<void | string> => {
  const userId = (await auth())?.user?.id;
  if (!userId) {
    return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
  }

  const { walletId, categoryId, type, amount, date, note } = data;
  const noteError = validateNote(note);
  if (noteError) {
    return noteError;
  }

  const { error, found } = await editTransaction(id, userId, {
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

  if (!found) {
    return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
  }

  updateTag(`${CACHE_TAGS.TRANSACTIONS}/${userId}`);
  updateTag(`${CACHE_TAGS.TRANSACTION}/${id}`);
  updateTag(`${CACHE_TAGS.WALLETS}/${userId}`);
};

export const deleteTransaction = async (id: string): Promise<void | string> => {
  const userId = (await auth())?.user?.id;
  if (!userId) {
    return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
  }

  const { error, found } = await removeTransaction(id, userId);

  if (error) {
    return error.message;
  }

  if (!found) {
    return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
  }

  updateTag(`${CACHE_TAGS.TRANSACTIONS}/${userId}`);
  updateTag(`${CACHE_TAGS.WALLETS}/${userId}`);
};

export const fetchTransactionDetail = async (id: string) => {
  const userId = (await auth())?.user?.id;
  if (!userId) {
    return null;
  }

  return getTransactionById(id, userId);
};
