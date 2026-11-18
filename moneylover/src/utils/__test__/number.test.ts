// Utils
import { formatAmount } from '@/utils/number';

describe('formatAmount', () => {
  it('formats amount with commas', () => {
    expect(formatAmount(1000000, 'VND', false)).toBe('1,000,000 đ');
  });

  it('shows + sign for positive amount when showSign is true', () => {
    expect(formatAmount(500000, 'VND', true)).toBe('+500,000 đ');
  });

  it('shows - sign for negative amount when showSign is true', () => {
    expect(formatAmount(-500000, 'VND', true)).toBe('-500,000 đ');
  });

  it('does not show sign when showSign is false', () => {
    const result = formatAmount(500000, 'VND', false);
    expect(result).not.toContain('+');
    expect(result).not.toContain('-');
  });

  it('prepends minus sign when outflow is true', () => {
    expect(formatAmount(500000, 'VND', false, true)).toBe('-500,000 đ');
  });

  it('uses currency symbol', () => {
    expect(formatAmount(100, 'USD', false)).toContain('$');
  });

  it('falls back to currency code when symbol not found', () => {
    expect(formatAmount(100, 'XYZ', false)).toContain('XYZ');
  });

  it('handles zero amount', () => {
    expect(formatAmount(0, 'VND', false)).toBe('0 đ');
  });

  // ML-004: amounts are whole numbers, so the decimal part is dropped (truncated towards zero)
  it('drops the decimal part instead of grouping its digits', () => {
    expect(formatAmount(1234.5678)).toBe('+1,234 đ');
  });

  it('drops a two-digit decimal part', () => {
    expect(formatAmount(1234.56)).toBe('+1,234 đ');
  });

  it('truncates negative decimals towards zero', () => {
    expect(formatAmount(-1234.9)).toBe('-1,234 đ');
  });

  it('does not show a minus sign when a small negative decimal truncates to zero', () => {
    expect(formatAmount(-0.5)).toBe('+0 đ');
  });

  // ML-005: a missing or broken value is shown as zero, not as NaN / Infinity
  it.each([NaN, Infinity, -Infinity])('shows %p as zero', (value) => {
    expect(formatAmount(value)).toBe('+0 đ');
    expect(formatAmount(value, 'VND', false)).toBe('0 đ');
  });
});
