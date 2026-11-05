// Types
import { FinanceType } from '@/types';

// Constants
import { CURRENCIES } from '@/constants';

// Utils
import { cn, formatAmount, getDay, getFullDate } from '@/utils';

interface TransactionItemProps {
  date: string;
  note?: string;
  amount: number;
  type: FinanceType;
  currency?: string;
  onClick: () => void;
}

export const TransactionItem = ({
  date,
  note = '',
  amount,
  type,
  currency = CURRENCIES[0].code,
  onClick,
}: TransactionItemProps) => {
  const day = getDay(date);
  const fullDate = getFullDate(date);

  return (
    <div
      className="flex items-center gap-4 border-b border-gray-100 px-4 py-3 last:border-b-0 cursor-pointer"
      onClick={onClick}
    >
      <p className="text-2xl font-light text-gray-400">{day}</p>
      <div className="flex-1">
        <p className="text-sm text-gray-700">{fullDate}</p>
        {note && <p className="text-xs text-gray-400">{note}</p>}
      </div>
      <p
        className={cn(
          'text-sm font-medium',
          type === FinanceType.Income ? 'text-blue-500' : 'text-red-500',
        )}
      >
        {formatAmount(amount, currency, false)}
      </p>
    </div>
  );
};
