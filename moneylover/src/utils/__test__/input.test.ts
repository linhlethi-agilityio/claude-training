// Utils
import { parseNumber, formatCurrency, clearErrorOnChange } from '@/utils/input';

describe('parseNumber', () => {
  it('strips non-digit characters and returns number', () => {
    expect(parseNumber('1,000,000')).toBe(1000000);
  });

  it('returns 0 for empty string', () => {
    expect(parseNumber('')).toBe(0);
  });

  it('handles plain number string', () => {
    expect(parseNumber('5000')).toBe(5000);
  });

  it('strips letters and symbols', () => {
    expect(parseNumber('$1.000abc')).toBe(1000);
  });

  // ML-003: amounts are whole numbers, so a decimal fraction is dropped, not merged.
  it('drops a decimal fraction instead of merging it into the integer part', () => {
    expect(parseNumber('12.5')).toBe(12);
    expect(parseNumber('1,234.56')).toBe(1234);
  });

  it('keeps "." followed by 3 digits as a thousands separator', () => {
    expect(parseNumber('1.000.000')).toBe(1000000);
  });

  it('ignores a trailing "." while the user is typing', () => {
    expect(parseNumber('12.')).toBe(12);
  });
});

describe('formatCurrency', () => {
  it('formats number with commas', () => {
    expect(formatCurrency(1000000)).toBe('1,000,000');
  });

  it('formats string with commas', () => {
    expect(formatCurrency('1000000')).toBe('1,000,000');
  });

  it('strips non-digits from string before formatting', () => {
    expect(formatCurrency('1,000,000')).toBe('1,000,000');
  });

  it('handles 0', () => {
    expect(formatCurrency(0)).toBe('0');
  });

  it('handles small numbers', () => {
    expect(formatCurrency(500)).toBe('500');
  });

  // ML-003
  it('drops a decimal fraction from a string', () => {
    expect(formatCurrency('1234.56')).toBe('1,234');
  });

  it('drops a decimal fraction from a number', () => {
    expect(formatCurrency(1234.56)).toBe('1,234');
    expect(formatCurrency(1234.5678)).toBe('1,234');
  });
});

describe('clearErrorOnChange', () => {
  it('calls clearErrors when field has an error message', () => {
    const clearErrors = jest.fn();
    const errors = { email: { message: 'Required' } } as Record<string, { message: string }>;
    clearErrorOnChange('email', errors as never, clearErrors as never);
    expect(clearErrors).toHaveBeenCalledWith('email');
  });

  it('does not call clearErrors when field has no error', () => {
    const clearErrors = jest.fn();
    const errors = {};
    clearErrorOnChange('email', errors as never, clearErrors as never);
    expect(clearErrors).not.toHaveBeenCalled();
  });
});
