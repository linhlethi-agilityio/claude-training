export interface Wallet {
  id: string;
  user_id: string;
  name: string;
  currency: string;
  balance: number;
  created_at: string;
}

export interface WalletFormData {
  name: string;
  currency: string;
  balance?: string | number;
}
