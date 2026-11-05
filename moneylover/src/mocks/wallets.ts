import { Wallet } from '@/types';

export const MOCK_WALLETS: Wallet[] = [
  {
    id: '1',
    user_id: 'user-1',
    name: 'Cash',
    currency: 'VND',
    balance: 1000000,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    user_id: 'user-1',
    name: 'Bank Account',
    currency: 'VND',
    balance: 5000000,
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    user_id: 'user-1',
    name: 'Savings',
    currency: 'USD',
    balance: 200,
    created_at: '2024-01-03T00:00:00Z',
  },
];
