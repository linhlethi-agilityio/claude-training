import { Category, FinanceType } from '@/types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    user_id: '',
    parent_id: null,
    name: 'Food & Beverage',
    image_url: '',
    type: FinanceType.Expense,
  },
  {
    id: '2',
    user_id: '',
    parent_id: null,
    name: 'Transportation',
    image_url: '',
    type: FinanceType.Expense,
  },
  {
    id: '3',
    user_id: '',
    parent_id: null,
    name: 'Rentals',
    image_url: '',
    type: FinanceType.Expense,
  },
  {
    id: '10',
    user_id: '',
    parent_id: null,
    name: 'Other Utility Bills',
    image_url: '',
    type: FinanceType.Expense,
  },
  {
    id: '11',
    user_id: '',
    parent_id: null,
    name: 'Home Maintenance',
    image_url: '',
    type: FinanceType.Expense,
  },
  {
    id: '12',
    user_id: '',
    parent_id: null,
    name: 'Vehicle Maintenance',
    image_url: '',
    type: FinanceType.Expense,
  },

  // Parent categories - Income
  {
    id: '13',
    user_id: '',
    parent_id: null,
    name: 'Salary',
    image_url: '',
    type: FinanceType.Income,
  },
  {
    id: '14',
    user_id: '',
    parent_id: null,
    name: 'Bonus',
    image_url: '',
    type: FinanceType.Income,
  },
  {
    id: '15',
    user_id: '',
    parent_id: null,
    name: 'Investment',
    image_url: '',
    type: FinanceType.Income,
  },

  {
    id: '101',
    user_id: '',
    parent_id: '1',
    name: 'Restaurant',
    image_url: '',
    type: FinanceType.Expense,
  },
  {
    id: '102',
    user_id: '',
    parent_id: '1',
    name: 'Coffee',
    image_url: '',
    type: FinanceType.Expense,
  },
  {
    id: '103',
    user_id: '',
    parent_id: '1',
    name: 'Groceries',
    image_url: '',
    type: FinanceType.Expense,
  },

  {
    id: '201',
    user_id: '',
    parent_id: '2',
    name: 'Taxi',
    image_url: '',
    type: FinanceType.Expense,
  },
  {
    id: '202',
    user_id: '',
    parent_id: '2',
    name: 'Parking',
    image_url: '',
    type: FinanceType.Expense,
  },
  {
    id: '203',
    user_id: '',
    parent_id: '2',
    name: 'Fuel',
    image_url: '',
    type: FinanceType.Expense,
  },

  {
    id: '301',
    user_id: '',
    parent_id: '3',
    name: 'Rent',
    image_url: '',
    type: FinanceType.Expense,
  },
  {
    id: '302',
    user_id: '',
    parent_id: '3',
    name: 'Mortgage',
    image_url: '',
    type: FinanceType.Expense,
  },

  {
    id: '1301',
    user_id: '',
    parent_id: '13',
    name: 'Monthly Salary',
    image_url: '',
    type: FinanceType.Income,
  },

  {
    id: '1501',
    user_id: '',
    parent_id: '15',
    name: 'Stocks',
    image_url: '',
    type: FinanceType.Income,
  },
  {
    id: '1502',
    user_id: '',
    parent_id: '15',
    name: 'Savings Interest',
    image_url: '',
    type: FinanceType.Income,
  },
];

export const MOCK_EXPENSE_CATEGORIES = MOCK_CATEGORIES.filter(
  (c) => c.type === FinanceType.Expense && c.parent_id === null,
);

export const MOCK_INCOME_CATEGORIES = MOCK_CATEGORIES.filter(
  (c) => c.type === FinanceType.Income && c.parent_id === null,
);

export const MOCK_SUB_CATEGORIES = MOCK_CATEGORIES.filter((c) => c.parent_id !== null);
