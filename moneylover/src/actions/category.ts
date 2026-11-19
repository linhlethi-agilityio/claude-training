'use server';

import { updateTag } from 'next/cache';

// Constants
import { CACHE_TAGS, ERROR_MESSAGES } from '@/constants';

// Types
import { FinanceType } from '@/types';

// Configs
import { auth } from '@/configs/auth';

// Libs
import { addCategory, editCategory, removeCategory } from '@/libs';

interface CreateCategoryParams {
  name: string;
  type: string;
  parentId?: string | null;
}

export const createCategory = async ({
  name,
  type,
  parentId = null,
}: CreateCategoryParams): Promise<void | string> => {
  const userId = (await auth())?.user?.id;
  if (!userId) {
    return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
  }

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
  name: string;
  type: string;
  parentId?: string | null;
}

export const updateCategory = async ({
  id,
  name,
  type,
  parentId = null,
}: UpdateCategoryParams): Promise<void | string> => {
  const userId = (await auth())?.user?.id;
  if (!userId) {
    return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
  }

  const { error, found } = await editCategory({
    id,
    user_id: userId,
    name,
    type: type as FinanceType,
    parent_id: parentId,
  });

  if (error) {
    return error.message;
  }

  if (!found) {
    return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
  }

  updateTag(`${CACHE_TAGS.CATEGORIES}/${userId}`);
};

export const deleteCategory = async (categoryId: string): Promise<void | string> => {
  const userId = (await auth())?.user?.id;
  if (!userId) {
    return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
  }

  const { error, found } = await removeCategory(categoryId, userId);

  if (error) {
    return error.message;
  }

  if (!found) {
    return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
  }

  updateTag(`${CACHE_TAGS.CATEGORIES}/${userId}`);
};
