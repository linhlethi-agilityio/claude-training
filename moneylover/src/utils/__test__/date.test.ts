// Constants
import { TransactionPeriod } from '@/constants';

// Utils
import {
  getDay,
  getFullDate,
  toDateString,
  getPeriodOffset,
  getMonthLabel,
  getPeriodKey,
  getMonthRange,
} from '@/utils/date';

describe('getDay', () => {
  it('returns the day of month', () => {
    expect(getDay('2024-03-15')).toBe(15);
    expect(getDay('2024-01-01')).toBe(1);
  });
});

describe('getFullDate', () => {
  it('returns formatted full date string', () => {
    const result = getFullDate('2024-03-15');
    expect(result).toContain('March');
    expect(result).toContain('2024');
    expect(result).toContain('15');
  });
});

describe('toDateString', () => {
  it('formats date as YYYY-MM-DD', () => {
    expect(toDateString(new Date(2024, 2, 15))).toBe('2024-03-15');
  });

  it('pads month and day with zero', () => {
    expect(toDateString(new Date(2024, 0, 5))).toBe('2024-01-05');
  });
});

describe('getPeriodOffset', () => {
  it('returns 0 for "this"', () => {
    expect(getPeriodOffset(TransactionPeriod.This)).toBe(0);
  });

  it('returns -1 for "last"', () => {
    expect(getPeriodOffset(TransactionPeriod.Last)).toBe(-1);
  });

  it('returns numeric offset for numeric string', () => {
    expect(getPeriodOffset('-2')).toBe(-2);
    expect(getPeriodOffset('3')).toBe(3);
  });
});

describe('getMonthLabel', () => {
  it('returns "THIS MONTH" for offset 0', () => {
    expect(getMonthLabel(0)).toBe('THIS MONTH');
  });

  it('returns "LAST MONTH" for offset -1', () => {
    expect(getMonthLabel(-1)).toBe('LAST MONTH');
  });

  it('returns formatted month/year for other offsets', () => {
    const result = getMonthLabel(-2);
    expect(result).toMatch(/\d{2}\/\d{4}/);
  });
});

describe('getPeriodKey', () => {
  it('returns "this" for offset 0', () => {
    expect(getPeriodKey(0)).toBe(TransactionPeriod.This);
  });

  it('returns "last" for offset -1', () => {
    expect(getPeriodKey(-1)).toBe(TransactionPeriod.Last);
  });

  it('returns string number for other offsets', () => {
    expect(getPeriodKey(-2)).toBe('-2');
    expect(getPeriodKey(3)).toBe('3');
  });
});

describe('getMonthRange', () => {
  it('returns startDate and endDate for "this" period', () => {
    const result = getMonthRange(TransactionPeriod.This);
    expect(result.startDate).toMatch(/^\d{4}-\d{2}-01$/);
    expect(result.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('returns future range for "future" period', () => {
    const result = getMonthRange(TransactionPeriod.Future);
    expect(result.startLabel).toBe('Future');
    expect(new Date(result.startDate) > new Date()).toBe(true);
  });

  it('returns full month range for "last" period', () => {
    const result = getMonthRange(TransactionPeriod.Last);
    expect(result.startDate).toMatch(/^\d{4}-\d{2}-01$/);
    expect(result.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
