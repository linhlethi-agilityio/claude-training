'use server';

import { updateTag } from 'next/cache';

// Constants
import { CACHE_TAGS } from '@/constants';

// Types
import { FinanceType, Wallet } from '@/types';

// Libs
import { addWallet, editWallet, removeWallet, addTransaction, getDefaultCategoryByType } from '@/libs';

// Utils
import { toDateString } from '@/utils';

interface CreateWalletParams {
  userId: string;
  name: string;
  currency: string;
  balance?: number;
}

export const createWallet = async ({
  userId,
  name,
  currency,
  balance = 0,
}: CreateWalletParams): Promise<void | string> => {
  const { data: walletData, error: walletError } = await addWallet({
    user_id: userId,
    name,
    currency,
    balance,
  });

  if (walletError) {
    return walletError.message;
  }

  if (balance > 0 && walletData) {
    const otherIncomeCategory = await getDefaultCategoryByType(userId, FinanceType.Income);

    if (otherIncomeCategory) {
      await addTransaction({
        user_id: userId,
        wallet_id: walletData.id,
        category_id: otherIncomeCategory.id,
        type: FinanceType.Income,
        amount: balance,
        date: toDateString(new Date()),
        note: 'Initial balance',
      });
    }
  }

  updateTag(`${CACHE_TAGS.WALLETS}/${userId}`);
  updateTag(`${CACHE_TAGS.TRANSACTIONS}/${userId}`);
};

export const updateWallet = async ({
  id,
  user_id,
  name,
  currency,
  balance,
}: Partial<Wallet>): Promise<void | string> => {
  const { error } = await editWallet({ id, name, currency, balance });

  if (error) {
    return error.message;
  }

  updateTag(`${CACHE_TAGS.WALLETS}/${user_id}`);
};

export const deleteWallet = async (walletId: string, userId: string): Promise<void | string> => {
  const { error } = await removeWallet(walletId);

  if (error) {
    return error.message;
  }

  updateTag(`${CACHE_TAGS.WALLETS}/${userId}`);
  updateTag(`${CACHE_TAGS.TRANSACTIONS}/${userId}`);
};
