// Configs
import { auth } from '@/configs/auth';

// Services
import { getWalletsInfo, getRecentTransactionsList } from '@/services';

// Components
import { RecentTransactions } from '@/components';

export const HomeContent = async () => {
  const session = await auth();
  const userId = session?.user?.id ?? '';

  const [{ wallets, currency }, transactions] = await Promise.all([
    getWalletsInfo(userId),
    getRecentTransactionsList(userId),
  ]);

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6 p-6">
      <RecentTransactions wallets={wallets} transactions={transactions} currency={currency} />
    </div>
  );
};
