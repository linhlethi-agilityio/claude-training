'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Constants
import { CURRENCIES, ERROR_MESSAGES, ROUTES, SUCCESS_MESSAGES } from '@/constants';

// Types
import { Wallet, WalletFormData } from '@/types';

// Actions
import { createWallet, updateWallet } from '@/actions';

// Hooks
import { useToast } from '@/hooks';

// Utils
import { clearErrorOnChange, formatCurrency, parseNumber, walletSchema } from '@/utils';

// Components
import { Button, Input } from '@/components';

const REQUIRED_FIELDS = ['name'];

interface WalletFormProps {
  userId: string;
  showBalance?: boolean;
  previewData?: Wallet;
  onSubmit?: () => void;
}

export const WalletForm = ({
  userId,
  showBalance = false,
  previewData,
  onSubmit,
}: WalletFormProps) => {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();

  const {
    control,
    formState: { dirtyFields, errors },
    clearErrors,
    handleSubmit,
    setValue,
  } = useForm<WalletFormData>({
    resolver: zodResolver(walletSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: previewData || {
      name: '',
      currency: 'VND',
    },
  });

  const watchedValues = useWatch({ control });

  const selectedCurrency = watchedValues.currency;

  const enableSubmit = previewData
    ? Object.keys(dirtyFields).length > 0 && !Object.keys(errors).length
    : REQUIRED_FIELDS.every((field) => !!watchedValues[field as keyof WalletFormData]) &&
      !Object.keys(errors).length;

  const handleFormSubmit = (formData: WalletFormData) => {
    startTransition(async () => {
      const balance = parseNumber(String(formData.balance ?? 0));

      const error = previewData
        ? await updateWallet({ id: previewData.id, user_id: userId, ...formData, balance })
        : await createWallet({ userId, ...formData, balance });

      if (error) {
        return showToast({
          status: 'error',
          title: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
          description: error,
        });
      }

      showToast({
        status: 'success',
        title: previewData ? SUCCESS_MESSAGES.WALLET_UPDATED : SUCCESS_MESSAGES.WALLET_CREATED,
      });

      if (onSubmit) {
        onSubmit();
      } else {
        router.replace(ROUTES.DASHBOARD);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
      <Controller
        name="name"
        control={control}
        render={({ field: { name, onChange, ...rest }, fieldState: { error } }) => (
          <Input
            label="Wallet Name"
            placeholder="e.g. Cash, Bank Account"
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
        <p className="mb-1 text-xs text-gray-400">Currency</p>
        <div className="space-y-2">
          {CURRENCIES.map(({ code, label }) => (
            <div
              key={code}
              onClick={() => setValue('currency', code, { shouldDirty: true })}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                selectedCurrency === code
                  ? 'border-lime-600 bg-lime-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="text-sm font-medium text-gray-900">{label}</span>
              <span className="ml-auto text-xs text-gray-400">{code}</span>
            </div>
          ))}
        </div>
      </div>

      {(showBalance || previewData) && (
        <Controller
          name="balance"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <Input
              label={previewData ? 'Balance' : 'Initial Balance'}
              placeholder="0"
              value={value ?? ''}
              onChange={(e) => {
                const num = parseNumber(e.target.value);
                onChange(num ? formatCurrency(num.toString()) : '');
              }}
              {...rest}
            />
          )}
        />
      )}

      <Button
        type="submit"
        size="lg"
        isLoading={isPending}
        disabled={!enableSubmit}
        className="w-full"
      >
        {previewData ? 'Save' : 'Submit'}
      </Button>
    </form>
  );
};
