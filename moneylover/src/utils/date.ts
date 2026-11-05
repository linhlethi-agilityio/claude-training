// Constants
import { TransactionPeriod } from '@/constants';

export const getDay = (date: string): number => new Date(date).getDate();

export const getFullDate = (date: string): string =>
  new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export const toDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const getPeriodOffset = (period: string): number => {
  const map: Record<string, number> = {
    [TransactionPeriod.This]: 0,
    [TransactionPeriod.Last]: -1,
  };

  return (map[period] ?? Number(period)) || 0;
};

const offsetToDate = (offset: number, day = 1): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + offset, day);
};

export const getMonthLabel = (offset: number): string => {
  const specialLabels: Record<number, string> = {
    0: 'THIS MONTH',
    [-1]: 'LAST MONTH',
  };

  if (offset in specialLabels) return specialLabels[offset];

  return offsetToDate(offset).toLocaleDateString('en-US', {
    month: '2-digit',
    year: 'numeric',
  });
};

export const getPeriodKey = (offset: number): string => {
  const reverseMap: Record<number, string> = {
    0: TransactionPeriod.This,
    [-1]: TransactionPeriod.Last,
  };

  return reverseMap[offset] ?? String(offset);
};

export const getMonthRange = (period: string) => {
  const now = new Date();

  if (period === TransactionPeriod.Future) {
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const endFuture = new Date(now.getFullYear(), now.getMonth() + 12, now.getDate());

    return {
      startDate: toDateString(tomorrow),
      endDate: toDateString(endFuture),
      startLabel: 'Future',
      endLabel: '',
    };
  }

  const offset = getPeriodOffset(period);

  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);

  const end = offset === 0 ? now : new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);

  const startDate = toDateString(start);
  const endDate = toDateString(end);

  return {
    startDate,
    endDate,
    startLabel: startDate,
    endLabel: endDate,
  };
};
