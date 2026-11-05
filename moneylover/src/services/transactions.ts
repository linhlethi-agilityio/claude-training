'use cache';

import { cacheTag } from 'next/cache';

// Constants
import { CACHE_TAGS, RECENT_TRANSACTION_LIMIT } from '@/constants';

// Libs
import {
  getTransactions,
  getTransactionBalanceByDate,
  getTransactionById,
  getRecentTransactions,
} from '@/libs';

// Types
import { TransactionWithCategory } from '@/types';

export const getRecentTransactionsList = async (
  userId: string,
  limit = RECENT_TRANSACTION_LIMIT,
) => {
  cacheTag(`${CACHE_TAGS.TRANSACTIONS}/${userId}`);
  return getRecentTransactions(userId, limit);
};

export const getTransactionDetailById = async (id: string) => {
  cacheTag(`${CACHE_TAGS.TRANSACTION}/${id}`);
  return getTransactionById(id);
};

export const getTransactionsByDate = async (
  userId: string,
  startDate: string,
  endDate: string,
  query?: string,
  walletId?: string,
) => {
  cacheTag(`${CACHE_TAGS.TRANSACTIONS}/${userId}`);

  const transactions = (await getTransactions(
    userId,
    startDate,
    endDate,
    query,
    walletId,
  )) as unknown as TransactionWithCategory[];
  const { inflow, outflow } = await getTransactionBalanceByDate(userId, startDate, endDate);

  const groupedByCategory = transactions.reduce<Record<string, typeof transactions>>((acc, t) => {
    const key = t.category_id;
    (acc[key] ??= []).push(t);
    return acc;
  }, {});

  return { transactions, inflow, outflow, groupedByCategory };
};
