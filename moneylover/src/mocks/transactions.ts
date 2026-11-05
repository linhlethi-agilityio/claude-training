import { FinanceType, Transaction, TransactionWithCategory } from '@/types';

// Mocks
import { MOCK_CATEGORIES } from './categories';

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-1',
    user_id: 'user-1',
    wallet_id: '1',
    type: FinanceType.Expense,
    category_id: '1',
    amount: 150000,
    note: 'Lunch',
    date: '2024-03-15',
    created_at: '2024-03-15T12:00:00Z',
  },
  {
    id: 'txn-2',
    user_id: 'user-1',
    wallet_id: '1',
    type: FinanceType.Income,
    category_id: '13',
    amount: 5000000,
    note: 'Monthly salary',
    date: '2024-03-01',
    created_at: '2024-03-01T09:00:00Z',
  },
  {
    id: 'txn-3',
    user_id: 'user-1',
    wallet_id: '2',
    type: FinanceType.Expense,
    category_id: '2',
    amount: 50000,
    note: '',
    date: '2024-03-10',
    created_at: '2024-03-10T08:00:00Z',
  },
];

export const MOCK_TRANSACTIONS_WITH_CATEGORY: TransactionWithCategory[] = [
  {
    ...MOCK_TRANSACTIONS[0],
    category: MOCK_CATEGORIES[0],
  },
  {
    ...MOCK_TRANSACTIONS[1],
    category: MOCK_CATEGORIES[6],
  },
  {
    ...MOCK_TRANSACTIONS[2],
    category: MOCK_CATEGORIES[1],
  },
];

export const MOCK_GROUPED_BY_CATEGORY = {
  '1': [MOCK_TRANSACTIONS_WITH_CATEGORY[0]],
  '13': [MOCK_TRANSACTIONS_WITH_CATEGORY[1]],
  '2': [MOCK_TRANSACTIONS_WITH_CATEGORY[2]],
};
