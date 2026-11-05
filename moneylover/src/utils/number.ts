import { CURRENCIES } from '@/constants';

export const formatAmount = (
  amount: number,
  currencyCode = CURRENCIES[0].code,
  showSign = true,
  outflow = false,
): string => {
  const isPositive = amount >= 0;
  const formatted = Math.abs(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const sign = showSign ? (isPositive ? '+' : '-') : amount < 0 ? '-' : '';
  const symbol = CURRENCIES.find((c) => c.code === currencyCode)?.symbol ?? currencyCode;

  return `${outflow ? '-' : sign}${formatted} ${symbol}`;
};
