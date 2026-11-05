import { UseFormClearErrors, FieldErrors, Path, FieldValues } from 'react-hook-form';

/**
 * Amounts are stored as whole numbers (bigint), so a trailing decimal fraction
 * ("12.5", "1,234.56") is dropped. A "." followed by 3 digits ("1.000") is still
 * treated as a thousands separator.
 */
const DECIMAL_FRACTION = /\.\d{1,2}$/;

const toIntegerDigits = (value: string): string =>
  value.replace(DECIMAL_FRACTION, '').replace(/\D/g, '');

/**
 * Parse numeric value from input, stripping non-digit characters
 */
export const parseNumber = (value: string): number => Number(toIntegerDigits(value));

/**
 * Format number with commas (e.g. 1,000,000)
 */
export const formatCurrency = (value: string | number): string => {
  const num = typeof value === 'number' ? String(Math.trunc(value)) : toIntegerDigits(value);

  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Clear errors for React hooks form
 */
export const clearErrorOnChange = <T extends FieldValues>(
  fieldName: Path<T>,
  errors: FieldErrors<T>,
  clearErrorFunc: UseFormClearErrors<T>,
): void => {
  if (errors[fieldName]?.message) {
    clearErrorFunc(fieldName);
  }
};
