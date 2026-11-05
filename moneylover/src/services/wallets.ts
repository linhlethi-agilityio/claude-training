'use cache';

import { cacheTag } from 'next/cache';

// Constants
import { CACHE_TAGS } from '@/constants';

// Libs
import { getWallets } from '@/libs';

export const getWalletsInfo = async (userId: string) => {
  cacheTag(`${CACHE_TAGS.WALLETS}/${userId}`);

  const wallets = await getWallets(userId);
  const totalBalance = wallets.reduce((sum, wallet) => sum + (wallet.balance ?? 0), 0);
  const currency = wallets[0]?.currency;

  return { wallets, totalBalance, currency };
};
