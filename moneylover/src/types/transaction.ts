import { Category } from './category';

export enum FinanceType {
  Income = 'income',
  Expense = 'expense',
}

export interface Transaction {
  id: string;
  user_id: string;
  wallet_id: string;
  type: FinanceType;
  category_id: string;
  amount: number;
  note: string;
  date: string;
  created_at: string;
}

export interface TransactionWithCategory extends Transaction {
  category: Category;
}

export interface TransactionFormData {
  type: FinanceType;
  walletId: string;
  categoryId: string;
  amount: number;
  date: string;
  note?: string;
}
