// Services
import { getCategoriesInfo, getTransactionsByDate, getWalletsInfo } from '@/services';

// Actions
import { fetchTransactionDetail } from '@/actions';

// Configs
import { auth } from '@/configs/auth';

// Utils
import { getMonthRange } from '@/utils';

// Components
import { TransactionList } from '@/components';

interface TransactionsContentProps {
  period: string;
  query?: string;
  walletId?: string;
}

export const TransactionsContent = async ({
  period,
  query = '',
  walletId = '',
}: TransactionsContentProps) => {
  const session = await auth();
  const userId = session?.user?.id ?? '';

  const { startDate, endDate } = getMonthRange(period);
  const { inflow, outflow, groupedByCategory } = await getTransactionsByDate(
    userId,
    startDate,
    endDate,
    query,
    walletId,
  );

  const [{ expenseCategories, incomeCategories }, { wallets }] = await Promise.all([
    getCategoriesInfo(userId),
    getWalletsInfo(userId),
  ]);

  return (
    <TransactionList
      userId={userId}
      wallets={wallets}
      inflow={inflow}
      outflow={outflow}
      groupedByCategory={groupedByCategory}
      expenseCategories={expenseCategories}
      incomeCategories={incomeCategories}
      getTransactionDetail={fetchTransactionDetail}
    />
  );
};
