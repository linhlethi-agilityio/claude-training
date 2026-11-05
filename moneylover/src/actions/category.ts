'use server';

import { updateTag } from 'next/cache';

// Constants
import { CACHE_TAGS } from '@/constants';

// Types
import { FinanceType } from '@/types';

// Libs
import { addCategory, editCategory, removeCategory } from '@/libs';

interface CreateCategoryParams {
  userId: string;
  name: string;
  type: string;
  parentId?: string | null;
}

export const createCategory = async ({
  userId,
  name,
  type,
  parentId = null,
}: CreateCategoryParams): Promise<void | string> => {
  const { error } = await addCategory({
    user_id: userId,
    parent_id: parentId,
    name,
    type: type as FinanceType,
  });

  if (error) {
    return error.message;
  }

  updateTag(`${CACHE_TAGS.CATEGORIES}/${userId}`);
};

interface UpdateCategoryParams {
  id: string;
  userId: string;
  name: string;
  type: string;
  parentId?: string | null;
}

export const updateCategory = async ({
  id,
  userId,
  name,
  type,
  parentId = null,
}: UpdateCategoryParams): Promise<void | string> => {
  const { error } = await editCategory({
    id,
    name,
    type: type as FinanceType,
    parent_id: parentId,
  });

  if (error) {
    return error.message;
  }

  updateTag(`${CACHE_TAGS.CATEGORIES}/${userId}`);
};

export const deleteCategory = async (categoryId: string, userId: string): Promise<void | string> => {
  const { error } = await removeCategory(categoryId);

  if (error) {
    return error.message;
  }

  updateTag(`${CACHE_TAGS.CATEGORIES}/${userId}`);
};
