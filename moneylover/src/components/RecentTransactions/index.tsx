'use client';

import Link from 'next/link';

// Constants
import { CURRENCIES, ROUTES } from '@/constants';

// Types
import { FinanceType, Wallet, TransactionWithCategory } from '@/types';

// Utils
import { formatAmount } from '@/utils';

// Components
import { CategoryInfo, WalletItem } from '@/components';

interface RecentTransactionsProps {
  transactions: TransactionWithCategory[];
  wallets: Wallet[];
  currency?: string;
}

export const RecentTransactions = ({
  transactions,
  currency = CURRENCIES[0].code,
  wallets,
}: RecentTransactionsProps) => (
  <>
    <div className="rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="font-semibold text-gray-900">My Wallets</p>
      </div>
      {wallets.map((wallet) => {
        const { id, name, balance, currency } = wallet;

        return (
          <WalletItem key={id} name={name} balance={balance} currency={currency} showBalance />
        );
      })}
    </div>
    <div className="rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="font-semibold text-gray-900">Recent transactions</h3>
        <Link href={ROUTES.TRANSACTIONS} className="text-sm font-medium text-lime-600">
          See all
        </Link>
      </div>
      {transactions.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-gray-400">No transactions</p>
      ) : (
        transactions.map(({ id, date, category: { name = '', image_url = '' }, type, amount }) => (
          <div
            key={id}
            className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0"
          >
            <div className="flex items-center gap-3 flex-1">
              <CategoryInfo name={name} imageUrl={image_url} date={date} />
            </div>
            <p
              className={`text-sm font-semibold ${type === FinanceType.Income ? 'text-blue-500' : 'text-red-500'}`}
            >
              {formatAmount(amount, currency, false, type !== FinanceType.Income)}
            </p>
          </div>
        ))
      )}
    </div>
  </>
);
