'use client';

import { useTransition } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Constants
import { CATEGORY_TYPES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';

// Types
import { Category, CategoryFormData, FinanceType } from '@/types';

// Actions
import { createCategory, updateCategory } from '@/actions';

// Hooks
import { useToast } from '@/hooks';

// Utils
import { clearErrorOnChange, cn, categorySchema } from '@/utils';

// Components
import { Button, Input, Dropdown } from '@/components';

const REQUIRED_FIELDS = ['name'];

interface CategoryFormProps {
  userId: string;
  expenseCategories?: Category[];
  incomeCategories?: Category[];
  previewData?: Category;
  onSubmit?: () => void;
}

export const CategoryForm = ({
  userId,
  expenseCategories = [],
  incomeCategories = [],
  previewData,
  onSubmit,
}: CategoryFormProps) => {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const isEditMode = !!previewData;

  const {
    control,
    formState: { dirtyFields, errors },
    clearErrors,
    handleSubmit,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: previewData
      ? {
          name: previewData.name,
          type: previewData.type,
          parentId: previewData.parent_id ?? '',
        }
      : {
          name: '',
          type: FinanceType.Expense,
          parentId: '',
        },
  });

  const watchedValues = useWatch({ control });

  const enableSubmit = isEditMode
    ? Object.keys(dirtyFields).length > 0 && !Object.keys(errors).length
    : REQUIRED_FIELDS.every((field) => !!watchedValues[field as keyof CategoryFormData]) &&
      !Object.keys(errors).length;

  const handleFormSubmit = (formData: CategoryFormData) => {
    startTransition(async () => {
      const { name, type, parentId } = formData;

      const error = isEditMode
        ? await updateCategory({
            id: previewData.id,
            userId,
            name: name,
            type: type,
            parentId: parentId || null,
          })
        : await createCategory({
            userId,
            name: name,
            type: type,
            parentId: parentId || null,
          });

      onSubmit?.();

      if (error) {
        return showToast({
          status: 'error',
          title: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
          description: error,
        });
      }

      showToast({
        status: 'success',
        title: isEditMode ? SUCCESS_MESSAGES.CATEGORY_UPDATED : SUCCESS_MESSAGES.CATEGORY_CREATED,
      });
    });
  };

  const selectedType = useWatch({ control, name: 'type' });

  const parentCategories =
    selectedType === FinanceType.Income ? incomeCategories : expenseCategories;

  const formattedDropdownCategories = parentCategories
    .filter((cat) => !cat.is_default && cat.id !== previewData?.id)
    .map((cat) => ({ id: cat.id, label: cat.name }));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <Controller
        name="name"
        control={control}
        render={({ field: { name, onChange, ...rest }, fieldState: { error } }) => (
          <Input
            label="Category Name"
            placeholder="e.g. Restaurant, Coffee"
            errorMessage={error?.message}
            onChange={(e) => {
              onChange(e.target.value);
              clearErrorOnChange(name, errors, clearErrors);
            }}
            {...rest}
          />
        )}
      />

      <div>
        <p className="mb-1 text-xs text-gray-400">Type</p>
        <Controller
          name="type"
          control={control}
          render={({ field: { value } }) => (
            <div className="flex gap-2">
              {CATEGORY_TYPES.map(({ key, label }) => (
                <Button
                  key={key}
                  type="button"
                  variant="ghost"
                  disabled={isEditMode}
                  onClick={() => setValue('type', key, { shouldDirty: true })}
                  className={cn(
                    'flex-1 rounded-lg border py-2 text-sm font-medium',
                    value === key
                      ? 'border-lime-600 bg-lime-50 text-lime-700'
                      : 'border-gray-200 text-gray-500',
                  )}
                >
                  {label}
                </Button>
              ))}
            </div>
          )}
        />
      </div>

      <Controller
        name="parentId"
        control={control}
        render={({ field: { value } }) => (
          <Dropdown
            label="Parent Category (optional)"
            placeholder="None (Parent category)"
            items={formattedDropdownCategories}
            value={value}
            onChange={(item) => setValue('parentId', item.id, { shouldDirty: true })}
          />
        )}
      />

      <Button
        type="submit"
        size="lg"
        isLoading={isPending}
        disabled={!enableSubmit}
        className="w-full"
      >
        {isEditMode ? 'Save' : 'Submit'}
      </Button>
    </form>
  );
};
