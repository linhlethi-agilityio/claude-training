'use client';

import { useTransition } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';

// Constants
import { CATEGORY_TYPES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';

// Types
import { Category, FinanceType, TransactionFormData, TransactionWithCategory, Wallet } from '@/types';

// Utils
import {
  clearErrorOnChange,
  cn,
  transactionSchema,
  formatCurrency,
  parseNumber,
  toDateString,
} from '@/utils';

// Actions
import { createTransaction, updateTransaction } from '@/actions';

// Hooks
import { useToast } from '@/hooks';

// Components
import { Button, Input, Dropdown } from '@/components';

const REQUIRED_FIELDS = ['categoryId', 'amount'];

interface TransactionFormProps {
  userId: string;
  wallets: Wallet[];
  expenseCategories?: Category[];
  incomeCategories?: Category[];
  previewData?: TransactionWithCategory;
  isLoading?: boolean;
  onSubmit: () => void;
}

export const TransactionForm = ({
  userId,
  wallets,
  expenseCategories = [],
  incomeCategories = [],
  previewData,
  isLoading = false,
  onSubmit,
}: TransactionFormProps) => {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const isEditMode = !!previewData;

  const {
    control,
    formState: { errors, dirtyFields },
    clearErrors,
    handleSubmit,
    setValue,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: previewData
      ? {
          type: previewData.type,
          walletId: previewData.wallet_id,
          categoryId: previewData.category_id,
          amount: previewData.amount,
          date: previewData.date,
          note: previewData.note ?? '',
        }
      : {
          type: FinanceType.Expense,
          walletId: wallets[0]?.id ?? '',
          categoryId: '',
          amount: 0,
          date: toDateString(new Date()),
          note: '',
        },
  });

  const watchedValues = useWatch({ control });

  const enableSubmit = isEditMode
    ? Object.keys(dirtyFields).length > 0 && !Object.keys(errors).length
    : REQUIRED_FIELDS.every((field) => !!watchedValues[field as keyof TransactionFormData]) &&
      !Object.keys(errors).length;

  const selectedType = watchedValues.type;

  const categories = selectedType === FinanceType.Income ? incomeCategories : expenseCategories;

  const dropdownCategories = categories.map((cat) => ({
    id: cat.id,
    label: cat.name,
    icon: cat.image_url ? (
      <Image src={cat.image_url} alt={cat.name} width={32} height={32} />
    ) : undefined,
  }));

  const handleFormSubmit = (data: TransactionFormData) => {
    startTransition(async () => {
      const error = isEditMode
        ? await updateTransaction(previewData.id, userId, data)
        : await createTransaction({ userId, ...data });

      if (error) {
        return showToast({
          status: 'error',
          title: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
          description: error,
        });
      }

      showToast({
        status: 'success',
        title: isEditMode
          ? SUCCESS_MESSAGES.TRANSACTION_UPDATED
          : SUCCESS_MESSAGES.TRANSACTION_CREATED,
      });
      onSubmit();
    });
  };

  const formattedWalletsDropdown = wallets.map(({ id, name }) => ({
    id,
    label: name,
  }));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      {/* Type */}
      <div>
        <p className="mb-1 text-xs text-gray-400">Type</p>
        <Controller
          name="type"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex gap-2">
              {CATEGORY_TYPES.map(({ key, label }) => (
                <Button
                  key={key}
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    onChange(key);
                    setValue('categoryId', '');
                  }}
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

      {/* Wallet */}
      <Controller
        name="walletId"
        control={control}
        render={({ field: { value, onChange, name } }) => (
          <Dropdown
            label="Wallet"
            placeholder="Select wallet"
            items={formattedWalletsDropdown}
            value={value}
            onChange={(item) => {
              onChange(item.id);
              clearErrorOnChange(name, errors, clearErrors);
            }}
          />
        )}
      />

      {/* Category */}
      <Controller
        name="categoryId"
        control={control}
        render={({ field: { value, onChange, name } }) => (
          <Dropdown
            label="Category"
            placeholder="Select category"
            items={dropdownCategories}
            value={value}
            onChange={(item) => {
              onChange(item.id);
              clearErrorOnChange(name, errors, clearErrors);
            }}
          />
        )}
      />

      {/* Amount */}
      <Controller
        name="amount"
        control={control}
        render={({ field: { name, value, onChange, ...rest }, fieldState: { error } }) => (
          <Input
            label="Amount"
            placeholder="0"
            errorMessage={error?.message}
            value={formatCurrency(value)}
            onChange={(e) => {
              onChange(parseNumber(e.target.value));
              clearErrorOnChange(name, errors, clearErrors);
            }}
            {...rest}
          />
        )}
      />

      {/* Date */}
      <Controller
        name="date"
        control={control}
        render={({ field: { name, onChange, ...rest }, fieldState: { error } }) => (
          <Input
            type="date"
            label="Date"
            errorMessage={error?.message}
            onChange={(e) => {
              onChange(e.target.value);
              clearErrorOnChange(name, errors, clearErrors);
            }}
            {...rest}
          />
        )}
      />

      {/* Note */}
      <Controller
        name="note"
        control={control}
        render={({ field: { name, onChange, ...rest } }) => (
          <Input
            label="Note (optional)"
            placeholder="Add a note..."
            onChange={(e) => {
              onChange(e.target.value);
              clearErrorOnChange(name, errors, clearErrors);
            }}
            {...rest}
          />
        )}
      />

      <Button
        type="submit"
        size="lg"
        isLoading={isPending || isLoading}
        disabled={!enableSubmit}
        className="w-full"
      >
        Submit
      </Button>
    </form>
  );
};
