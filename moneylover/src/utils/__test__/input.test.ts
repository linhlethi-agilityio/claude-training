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
