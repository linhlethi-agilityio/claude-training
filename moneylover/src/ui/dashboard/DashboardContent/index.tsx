import { type ReactNode } from 'react';
import { redirect } from 'next/navigation';

// Services
import { getWalletsInfo, getCategoriesInfo } from '@/services';

// Configs
import { auth } from '@/configs/auth';

// Constants
import { ROUTES } from '@/constants';

// Layouts
import { Header } from '@/layouts';

interface DashboardContentProps {
  children: ReactNode;
}

export const DashboardContent = async ({ children }: DashboardContentProps) => {
  const session = await auth();

  const userId = session?.user?.id ?? '';

  const [{ wallets, totalBalance, currency }, { expenseCategories, incomeCategories }] =
    await Promise.all([getWalletsInfo(userId), getCategoriesInfo(userId)]);

  if (!wallets.length) {
    redirect(ROUTES.ONBOARDING);
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header
        userId={userId}
        totalBalance={totalBalance}
        currency={currency}
        wallets={wallets}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
      />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
};
