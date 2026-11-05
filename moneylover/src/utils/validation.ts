import { z } from 'zod';

// Constants
import { ERROR_MESSAGES } from '@/constants';

// Types
import { FinanceType } from '@/types';

export const signInSchema = z.object({
  email: z.string().nonempty(ERROR_MESSAGES.REQUIRED('Email')).email(ERROR_MESSAGES.EMAIL_INVALID),
  password: z
    .string()
    .nonempty(ERROR_MESSAGES.REQUIRED('Password'))
    .min(6, ERROR_MESSAGES.PASSWORD_MIN_LENGTH),
});

export const signUpSchema = z
  .object({
    email: z
      .string()
      .nonempty(ERROR_MESSAGES.REQUIRED('Email'))
      .email(ERROR_MESSAGES.EMAIL_INVALID),
    password: z
      .string()
      .nonempty(ERROR_MESSAGES.REQUIRED('Password'))
      .min(6, ERROR_MESSAGES.PASSWORD_MIN_LENGTH),
    confirmPassword: z.string().nonempty(ERROR_MESSAGES.REQUIRED('Confirm password')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH,
    path: ['confirmPassword'],
  });

export const categorySchema = z.object({
  name: z.string().nonempty(ERROR_MESSAGES.REQUIRED('Category name')),
  type: z.string().nonempty(ERROR_MESSAGES.REQUIRED('Type')),
  parentId: z.string().optional(),
});

export const walletSchema = z.object({
  name: z.string().nonempty(ERROR_MESSAGES.REQUIRED('Wallet name')),
  currency: z.string().nonempty(ERROR_MESSAGES.REQUIRED('Currency')),
  balance: z.union([z.string(), z.number()]).optional(),
});

export const transactionSchema = z.object({
  type: z.enum([FinanceType.Expense, FinanceType.Income]),
  walletId: z.string().nonempty(ERROR_MESSAGES.REQUIRED('Wallet')),
  categoryId: z.string().nonempty(ERROR_MESSAGES.REQUIRED('Category')),
  amount: z.number({ message: ERROR_MESSAGES.REQUIRED('Amount') }).min(0),
  date: z.string().nonempty(ERROR_MESSAGES.REQUIRED('Date')),
  note: z.string().optional(),
});
