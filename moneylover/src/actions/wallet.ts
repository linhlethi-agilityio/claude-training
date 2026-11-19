'use server';

import { updateTag } from 'next/cache';

// Constants
import { CACHE_TAGS, ERROR_MESSAGES } from '@/constants';

// Types
import { FinanceType } from '@/types';

// Configs
import { auth } from '@/configs/auth';

// Libs
import {
  addWallet,
  editWallet,
  removeWallet,
  addTransaction,
  getDefaultCategoryByType,
} from '@/libs';

// Utils
import { toDateString } from '@/utils';

interface CreateWalletParams {
  name: string;
  currency: string;
  balance?: number;
}

export const createWallet = async ({
  name,
  currency,
  balance = 0,
}: CreateWalletParams): Promise<void | string> => {
  const userId = (await auth())?.user?.id;
  if (!userId) {
    return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
  }

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

interface UpdateWalletParams {
  id: string;
  name?: string;
  currency?: string;
  balance?: number;
}

export const updateWallet = async ({
  id,
  name,
  currency,
  balance,
}: UpdateWalletParams): Promise<void | string> => {
  const userId = (await auth())?.user?.id;
  if (!userId) {
    return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
  }

  const { error, found } = await editWallet({ id, user_id: userId, name, currency, balance });

  if (error) {
    return error.message;
  }

  if (!found) {
    return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
  }

  updateTag(`${CACHE_TAGS.WALLETS}/${userId}`);
};

export const deleteWallet = async (walletId: string): Promise<void | string> => {
  const userId = (await auth())?.user?.id;
  if (!userId) {
    return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
  }

  const { error, found } = await removeWallet(walletId, userId);

  if (error) {
    return error.message;
  }

  if (!found) {
    return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
  }

  updateTag(`${CACHE_TAGS.WALLETS}/${userId}`);
  updateTag(`${CACHE_TAGS.TRANSACTIONS}/${userId}`);
};
