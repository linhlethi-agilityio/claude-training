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

export const editWallet = async ({ id, user_id, name, currency, balance }: Partial<Wallet>) => {
  const { data, error } = await supabase
    .from('wallets')
    .update({ name, currency, balance })
    .eq('id', id)
    .eq('user_id', user_id)
    .select('id');

  return { error, found: !!data?.length };
};

export const removeWallet = async (walletId: string, userId: string) => {
  const { data, error } = await supabase
    .from('wallets')
    .delete()
    .eq('id', walletId)
    .eq('user_id', userId)
    .select('id');

  return { error, found: !!data?.length };
};
