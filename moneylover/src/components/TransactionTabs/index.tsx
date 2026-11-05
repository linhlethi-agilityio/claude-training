'use client';

import { useRouter, useSearchParams } from 'next/navigation';

// Constants
import { TransactionPeriod, ROUTES } from '@/constants';

// Utils
import { cn, getMonthLabel, getPeriodOffset, getPeriodKey } from '@/utils';

// Components
import { Button } from '@/components';

interface TransactionTabsProps {
  period: string;
}

export const TransactionTabs = ({ period }: TransactionTabsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentOffset = getPeriodOffset(period);
  const isFuture = period === TransactionPeriod.Future;

  const nextOffset = currentOffset + 1;
  const isNextFuture = nextOffset > 0;

  const tabs = isFuture
    ? [
        { key: getPeriodKey(-1), label: getMonthLabel(-1) },
        { key: TransactionPeriod.This, label: 'THIS MONTH' },
        { key: TransactionPeriod.Future, label: 'FUTURE' },
      ]
    : [
        { key: getPeriodKey(currentOffset - 1), label: getMonthLabel(currentOffset - 1) },
        { key: period, label: getMonthLabel(currentOffset) },
        {
          key: isNextFuture ? TransactionPeriod.Future : getPeriodKey(nextOffset),
          label: isNextFuture ? 'FUTURE' : getMonthLabel(nextOffset),
        },
      ];

  const handleTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('period', key);
    router.push(`${ROUTES.TRANSACTIONS}?${params.toString()}`);
  };

  return (
    <div className="flex items-center rounded-lg border border-gray-200 bg-white">
      {tabs.map(({ key, label }) => (
        <Button
          key={key}
          variant="ghost"
          onClick={() => handleTabChange(key)}
          className={cn(
            'flex-1 rounded-none py-3 text-xs font-medium',
            key === period
              ? 'border-b-2 border-lime-600 text-lime-600 hover:text-lime-600'
              : 'text-gray-400 hover:text-gray-600',
          )}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};
