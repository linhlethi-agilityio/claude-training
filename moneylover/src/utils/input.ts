import { UseFormClearErrors, FieldErrors, Path, FieldValues } from 'react-hook-form';

/**
 * Parse numeric value from input, stripping non-digit characters
 */
export const parseNumber = (value: string): number => {
  const formatted = value.replace(/\D/g, '');

  return Number(formatted);
};

/**
 * Format number with commas (e.g. 1,000,000)
 */
export const formatCurrency = (value: string | number): string => {
  const num = typeof value === 'number' ? String(value) : value.replace(/\D/g, '');

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
