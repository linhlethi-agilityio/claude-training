import { CURRENCIES } from '@/constants';

export const formatAmount = (
  amount: number,
  currencyCode = CURRENCIES[0].code,
  showSign = true,
  outflow = false,
): string => {
  // Amounts are whole numbers (ML-003, ML-004): drop any decimal part, truncating towards zero.
  const whole = Math.trunc(amount);
  const isPositive = whole >= 0;
  const formatted = Math.abs(whole)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const sign = showSign ? (isPositive ? '+' : '-') : whole < 0 ? '-' : '';
  const symbol = CURRENCIES.find((c) => c.code === currencyCode)?.symbol ?? currencyCode;

  return `${outflow ? '-' : sign}${formatted} ${symbol}`;
};
