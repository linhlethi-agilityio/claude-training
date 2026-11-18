// Constants
import { CURRENCIES } from '@/constants';

// Utils
import { formatCurrency } from '@/utils/input';

export const formatAmount = (
  amount: number,
  currencyCode = CURRENCIES[0].code,
  showSign = true,
  outflow = false,
): string => {
  // Amounts are whole numbers (ML-003, ML-004): drop any decimal part, truncating towards zero.
  // A missing or broken value (NaN, Infinity) is shown as zero (ML-005).
  const whole = Number.isFinite(amount) ? Math.trunc(amount) : 0;
  const formatted = formatCurrency(Math.abs(whole));
  const sign = whole < 0 ? '-' : showSign ? '+' : '';
  const symbol = CURRENCIES.find((c) => c.code === currencyCode)?.symbol ?? currencyCode;

  return `${outflow ? '-' : sign}${formatted} ${symbol}`;
};
