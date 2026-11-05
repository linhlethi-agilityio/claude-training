import { type Metadata } from 'next';
import { Suspense } from 'react';

// Constants
import { TransactionPeriod } from '@/constants';

// Types
import { SearchParams } from '@/types';

// Components
import { TransactionTabs, TransactionSkeleton } from '@/components';

// UI
import { TransactionsContent } from '@/ui/transaction';

export const metadata: Metadata = {
  title: 'Transactions',
  description: 'View and manage your transactions.',
};

interface TransactionsPageProps {
  searchParams: SearchParams;
}

const TransactionsPage = async ({ searchParams }: TransactionsPageProps) => {
  const { period = TransactionPeriod.This, query = '', walletId } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="flex flex-col gap-4">
        <TransactionTabs period={period} />
        <Suspense key={`${period}-${query}-${walletId}`} fallback={<TransactionSkeleton />}>
          <TransactionsContent period={period} query={query} walletId={walletId} />
        </Suspense>
      </div>
    </div>
  );
};

export default TransactionsPage;
