'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';

// Constants
import { CURRENCIES, ERROR_MESSAGES, IMAGES, SUCCESS_MESSAGES } from '@/constants';

// Types
import { Category, TransactionWithCategory, Wallet } from '@/types';

// Actions
import { deleteTransaction } from '@/actions';

// Hooks
import { useToast } from '@/hooks';

// Utils
import { formatAmount } from '@/utils';

// Components
import {
  TransactionItem,
  TransactionDetailModal,
  TransactionForm,
  CategoryInfo,
  LoadingIndicator,
  ConfirmModal,
  Modal,
} from '@/components';

interface TransactionListProps {
  userId?: string;
  wallets?: Wallet[];
  inflow: number;
  outflow: number;
  groupedByCategory: Record<string, TransactionWithCategory[]>;
  currency?: string;
  expenseCategories?: Category[];
  incomeCategories?: Category[];
  getTransactionDetail: (transactionId: string) => Promise<TransactionWithCategory | null>;
}

export const TransactionList = ({
  userId = '',
  wallets = [],
  inflow,
  outflow,
  groupedByCategory,
  currency = CURRENCIES[0].code,
  expenseCategories = [],
  incomeCategories = [],
  getTransactionDetail,
}: TransactionListProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithCategory | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isOpenTransactionModal, setIsOpenTransactionModal] = useState(false);
  const { showToast } = useToast();
  const isTransactions = Object.keys(groupedByCategory).length > 0;

  const handleTransactionClick = (id: string) => {
    startTransition(async () => {
      const data = await getTransactionDetail(id);

      if (data) {
        setSelectedTransaction(data);
      }
    });
  };

  const handleOpenTransactionModal = () => {
    setIsOpenTransactionModal(true);
  };

  const handleEditTransaction = () => {
    if (!selectedTransaction) return;

    startTransition(async () => {
      const data = await getTransactionDetail(selectedTransaction.id);

      if (data) {
        setSelectedTransaction(data);
      }

      setIsOpenTransactionModal(false);
    });
  };

  const handleDeleteTransaction = () => {
    setIsOpenConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedTransaction) return;

    startTransition(async () => {
      const { id = '' } = selectedTransaction;

      const error = await deleteTransaction(id, userId);

      if (error) {
        return showToast({
          status: 'error',
          title: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
          description: error,
        });
      }

      showToast({ status: 'success', title: SUCCESS_MESSAGES.TRANSACTION_DELETED });
      setIsOpenConfirmModal(false);
      setSelectedTransaction(null);
    });
  };

  const handleCloseTransactionDetailModal = () => {
    setSelectedTransaction(null);
  };

  const handleCloseConfirmModal = () => {
    setIsOpenConfirmModal(false);
  };

  const handleCloseEditTransactionModal = () => {
    setIsOpenTransactionModal(false);
  };

  return (
    <>
      {isPending && <LoadingIndicator variant="overlay" />}
      {isTransactions ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="space-y-1 px-4 py-3">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Inflow</p>
                <p className="text-sm font-medium text-blue-500">
                  {formatAmount(inflow, currency, false)}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Outflow</p>
                <p className="text-sm font-medium text-red-500">
                  -{formatAmount(outflow, currency, false)}
                </p>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-1">
                <div />
                <p className="text-sm font-semibold text-gray-900">
                  {formatAmount(inflow - outflow, currency)}
                </p>
              </div>
            </div>
          </div>

          {Object.entries(groupedByCategory).map(([categoryId, transactions]) => {
            const category = transactions[0]?.category;

            const { name = '', image_url = '' } = category ?? {};
            const totalAmount = transactions.reduce((sum, t) => sum + (t.amount ?? 0), 0);

            return (
              <div key={categoryId} className="rounded-lg border border-gray-200 bg-white">
                <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
                  <CategoryInfo name={name} imageUrl={image_url} />
                  <p className="text-xs text-gray-400">{transactions.length} Transactions</p>
                  <div className="flex-1" />
                  <p className="text-sm font-semibold text-gray-900">
                    {formatAmount(totalAmount, currency, false)}
                  </p>
                </div>

                {transactions.map((t) => (
                  <TransactionItem
                    key={t.id}
                    date={t.date}
                    note={t.note}
                    amount={t.amount}
                    type={t.type}
                    currency={currency}
                    onClick={() => handleTransactionClick(t.id)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-12">
          <Image src={IMAGES.TRANSACTION_DATA} alt="No transactions" width={120} height={120} />
          <p className="text-sm text-gray-400">No transactions</p>
        </div>
      )}

      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          wallets={wallets}
          currency={currency}
          onEdit={handleOpenTransactionModal}
          onDelete={handleDeleteTransaction}
          onClose={handleCloseTransactionDetailModal}
        />
      )}

      {isOpenConfirmModal && (
        <ConfirmModal
          isOpen
          title="Delete transaction"
          description="Are you sure you want to delete this transaction?"
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseConfirmModal}
        />
      )}

      {isOpenTransactionModal && (
        <Modal isOpen title="Update Transaction" onClose={handleCloseEditTransactionModal}>
          <TransactionForm
            userId={userId}
            wallets={wallets}
            expenseCategories={expenseCategories}
            previewData={selectedTransaction ?? undefined}
            incomeCategories={incomeCategories}
            onSubmit={handleEditTransaction}
          />
        </Modal>
      )}
    </>
  );
};
