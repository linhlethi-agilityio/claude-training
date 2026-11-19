// Types
import { FinanceType } from '@/types';

// Utils
import {
  signInSchema,
  signUpSchema,
  categorySchema,
  walletSchema,
  transactionSchema,
} from '@/utils/validation';

describe('signInSchema', () => {
  it('passes with valid data', () => {
    expect(signInSchema.safeParse({ email: 'test@example.com', password: 'pass123' }).success).toBe(
      true,
    );
  });

  it('fails with invalid email', () => {
    expect(signInSchema.safeParse({ email: 'notanemail', password: 'pass123' }).success).toBe(
      false,
    );
  });

  it('fails with short password', () => {
    expect(signInSchema.safeParse({ email: 'test@example.com', password: '123' }).success).toBe(
      false,
    );
  });

  it('fails with empty fields', () => {
    expect(signInSchema.safeParse({ email: '', password: '' }).success).toBe(false);
  });
});

describe('signUpSchema', () => {
  const valid = { email: 'test@example.com', password: 'pass123', confirmPassword: 'pass123' };

  it('passes with valid matching passwords', () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true);
  });

  it('fails when passwords do not match', () => {
    expect(signUpSchema.safeParse({ ...valid, confirmPassword: 'different' }).success).toBe(false);
  });

  it('fails with empty confirmPassword', () => {
    expect(signUpSchema.safeParse({ ...valid, confirmPassword: '' }).success).toBe(false);
  });
});

describe('categorySchema', () => {
  it('passes with valid data', () => {
    expect(categorySchema.safeParse({ name: 'Food', type: 'expense' }).success).toBe(true);
  });

  it('fails with empty name', () => {
    expect(categorySchema.safeParse({ name: '', type: 'expense' }).success).toBe(false);
  });

  it('passes with optional parentId', () => {
    expect(categorySchema.safeParse({ name: 'Food', type: 'expense', parentId: '1' }).success).toBe(
      true,
    );
  });
});

describe('walletSchema', () => {
  it('passes with valid data', () => {
    expect(walletSchema.safeParse({ name: 'Cash', currency: 'VND' }).success).toBe(true);
  });

  it('fails with empty name', () => {
    expect(walletSchema.safeParse({ name: '', currency: 'VND' }).success).toBe(false);
  });

  it('fails with empty currency', () => {
    expect(walletSchema.safeParse({ name: 'Cash', currency: '' }).success).toBe(false);
  });

  it('passes with optional balance', () => {
    expect(walletSchema.safeParse({ name: 'Cash', currency: 'VND', balance: 100000 }).success).toBe(
      true,
    );
  });
});

describe('transactionSchema', () => {
  const valid = {
    type: FinanceType.Expense,
    walletId: 'wallet-1',
    categoryId: 'cat-1',
    amount: 100000,
    date: '2024-03-15',
    note: '',
  };

  it('passes with valid data', () => {
    expect(transactionSchema.safeParse(valid).success).toBe(true);
  });

  it('fails with empty walletId', () => {
    expect(transactionSchema.safeParse({ ...valid, walletId: '' }).success).toBe(false);
  });

  it('fails with empty categoryId', () => {
    expect(transactionSchema.safeParse({ ...valid, categoryId: '' }).success).toBe(false);
  });

  it('fails with invalid type', () => {
    expect(transactionSchema.safeParse({ ...valid, type: 'invalid' }).success).toBe(false);
  });

  it('passes with income type', () => {
    expect(transactionSchema.safeParse({ ...valid, type: FinanceType.Income }).success).toBe(true);
  });

  it('fails with amount 0 and shows the amount message', () => {
    const result = transactionSchema.safeParse({ ...valid, amount: 0 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Amount must be greater than 0');
  });

  it('passes with a note of exactly 255 characters', () => {
    expect(transactionSchema.safeParse({ ...valid, note: 'x'.repeat(255) }).success).toBe(true);
  });

  it('fails with a note longer than 255 characters', () => {
    const result = transactionSchema.safeParse({ ...valid, note: 'x'.repeat(256) });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Note must be at most 255 characters');
  });
});
