// Types
import { Wallet } from '@/types';

// Libs
import { supabase } from '@/libs/supabase';

type InsertWalletParams = Omit<Wallet, 'id' | 'created_at'>;

export const getWallets = async (userId: string) => {
  const { data } = await supabase.from('wallets').select('*').eq('user_id', userId);

  return data ?? [];
};

export const addWallet = async ({ user_id, name, currency, balance = 0 }: InsertWalletParams) => {
  const { data, error } = await supabase
    .from('wallets')
    .insert({ user_id, name, currency, balance })
    .select('id')
    .single();

  return { data, error };
};

export const editWallet = async ({ id, name, currency, balance }: Partial<Wallet>) => {
  const { error } = await supabase.from('wallets').update({ name, currency, balance }).eq('id', id);

  return { error };
};

export const removeWallet = async (walletId: string) => {
  const { error } = await supabase.from('wallets').delete().eq('id', walletId);

  return { error };
};
