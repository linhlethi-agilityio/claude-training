'use server';

// Constants
import { CACHE_TAGS, ERROR_MESSAGES } from '@/constants';

import { updateTag } from 'next/cache';

// Configs
import { auth } from '@/configs/auth';

// Actions
import { createCategory, updateCategory, deleteCategory } from '../category';

// Libs
import { addCategory, editCategory, removeCategory } from '@/libs';

jest.mock('@/libs', () => ({
  addCategory: jest.fn(),
  editCategory: jest.fn(),
  removeCategory: jest.fn(),
}));

// Lets a test call an action with extra arguments, like a tampered client request would.
const callUntyped = (fn: unknown, ...args: unknown[]) =>
  (fn as (...a: unknown[]) => Promise<unknown>)(...args);

beforeEach(() => {
  jest.clearAllMocks();
  (auth as jest.Mock).mockResolvedValue({ user: { id: 'user-1' } });
});

describe('createCategory', () => {
  it('should call addCategory with the session user and updateTag on success', async () => {
    (addCategory as jest.Mock).mockResolvedValue({ error: null });

    await createCategory({ name: 'Food', type: 'expense' });

    expect(addCategory).toHaveBeenCalledWith({
      user_id: 'user-1',
      parent_id: null,
      name: 'Food',
      type: 'expense',
    });
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.CATEGORIES}/user-1`);
  });

  it('should call addCategory with parentId when provided', async () => {
    (addCategory as jest.Mock).mockResolvedValue({ error: null });

    await createCategory({ name: 'Fast Food', type: 'expense', parentId: '1' });

    expect(addCategory).toHaveBeenCalledWith({
      user_id: 'user-1',
      parent_id: '1',
      name: 'Fast Food',
      type: 'expense',
    });
  });

  it('should ignore a userId sent by the client', async () => {
    (addCategory as jest.Mock).mockResolvedValue({ error: null });

    await callUntyped(createCategory, { userId: 'user-2', name: 'Food', type: 'expense' });

    expect(addCategory).toHaveBeenCalledWith(expect.objectContaining({ user_id: 'user-1' }));
  });

  it('should return the generic error without a session', async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const result = await createCategory({ name: 'Food', type: 'expense' });

    expect(result).toBe(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    expect(addCategory).not.toHaveBeenCalled();
  });

  it('should return error message when addCategory fails', async () => {
    (addCategory as jest.Mock).mockResolvedValue({ error: { message: 'Insert failed' } });

    const result = await createCategory({ name: 'Food', type: 'expense' });

    expect(result).toBe('Insert failed');
    expect(updateTag).not.toHaveBeenCalled();
  });
});

describe('updateCategory', () => {
  it('should call editCategory with the session user and updateTag on success', async () => {
    (editCategory as jest.Mock).mockResolvedValue({ error: null, found: true });

    await updateCategory({ id: '1', name: 'Food', type: 'expense' });

    expect(editCategory).toHaveBeenCalledWith({
      id: '1',
      user_id: 'user-1',
      name: 'Food',
      type: 'expense',
      parent_id: null,
    });
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.CATEGORIES}/user-1`);
  });

  it("should return the generic error for another user's category", async () => {
    (editCategory as jest.Mock).mockResolvedValue({ error: null, found: false });

    const result = await updateCategory({ id: 'other', name: 'Food', type: 'expense' });

    expect(result).toBe(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('should return the generic error without a session', async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const result = await updateCategory({ id: '1', name: 'Food', type: 'expense' });

    expect(result).toBe(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    expect(editCategory).not.toHaveBeenCalled();
  });

  it('should return error message when editCategory fails', async () => {
    (editCategory as jest.Mock).mockResolvedValue({
      error: { message: 'Update failed' },
      found: false,
    });

    const result = await updateCategory({ id: '1', name: 'Food', type: 'expense' });

    expect(result).toBe('Update failed');
    expect(updateTag).not.toHaveBeenCalled();
  });
});

describe('deleteCategory', () => {
  it('should call removeCategory with the session user and updateTag on success', async () => {
    (removeCategory as jest.Mock).mockResolvedValue({ error: null, found: true });

    await deleteCategory('1');

    expect(removeCategory).toHaveBeenCalledWith('1', 'user-1');
    expect(updateTag).toHaveBeenCalledWith(`${CACHE_TAGS.CATEGORIES}/user-1`);
  });

  it('should ignore a userId sent by the client', async () => {
    (removeCategory as jest.Mock).mockResolvedValue({ error: null, found: true });

    await callUntyped(deleteCategory, '1', 'user-2');

    expect(removeCategory).toHaveBeenCalledWith('1', 'user-1');
  });

  it("should return the generic error for another user's category", async () => {
    (removeCategory as jest.Mock).mockResolvedValue({ error: null, found: false });

    const result = await deleteCategory('other');

    expect(result).toBe(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('should return the generic error without a session', async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const result = await deleteCategory('1');

    expect(result).toBe(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    expect(removeCategory).not.toHaveBeenCalled();
  });

  it('should return error message when removeCategory fails', async () => {
    (removeCategory as jest.Mock).mockResolvedValue({
      error: { message: 'Delete failed' },
      found: false,
    });

    const result = await deleteCategory('1');

    expect(result).toBe('Delete failed');
    expect(updateTag).not.toHaveBeenCalled();
  });
});
