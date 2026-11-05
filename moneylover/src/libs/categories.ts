// Types
import { Category, FinanceType } from '@/types';

// Libs
import { supabase } from '@/libs/supabase';

export const getDefaultCategoryByType = async (userId: string, type: FinanceType) => {
  const { data } = await supabase
    .from('categories')
    .select('id')
    .eq('user_id', userId)
    .eq('type', type)
    .eq('is_default', true)
    .ilike('name', '%other%')
    .single();

  return data;
};

export const getParentCategories = async (userId: string, type: FinanceType, query?: string) => {
  const baseQuery = supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)
    .is('parent_id', null);

  const finalQuery = query ? baseQuery.ilike('name', `%${query}%`) : baseQuery;

  const { data } = await finalQuery;

  return data ?? [];
};

export const getSubCategoriesByParentIds = async (parentIds: string[]) => {
  if (!parentIds.length) return [];

  const { data } = await supabase.from('categories').select('*').in('parent_id', parentIds);

  return data ?? [];
};

export const addCategory = async ({ user_id, parent_id, name, type }: Partial<Category>) => {
  const { error } = await supabase.from('categories').insert({ user_id, parent_id, name, type });

  return { error };
};

export const editCategory = async ({ id, name, type, parent_id }: Partial<Category>) => {
  if (parent_id) {
    await supabase.from('categories').update({ parent_id }).eq('parent_id', id);
  }

  const { error } = await supabase
    .from('categories')
    .update({ name, type, parent_id })
    .eq('id', id);

  return { error };
};

export const removeCategory = async (categoryId: string) => {
  const { error } = await supabase.from('categories').delete().eq('id', categoryId);

  return { error };
};
