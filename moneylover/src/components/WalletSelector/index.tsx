'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Constants
import { ERROR_MESSAGES, IMAGES, ROUTES, SUCCESS_MESSAGES } from '@/constants';

// Types
import { Wallet } from '@/types';

// Icons
import { ChevronRightIcon } from '@/icons';

// Utils
import { formatAmount } from '@/utils';

// Actions
import { deleteWallet } from '@/actions';

// Hooks
import { useToast } from '@/hooks';

// Components
import {
  Avatar,
  Modal,
  ConfirmModal,
  WalletSelectorSkeleton,
  WalletList,
  WalletForm,
} from '@/components';

interface WalletSelectorProps {
  userId: string;
  totalBalance: number;
  currency: string;
  wallets: Wallet[];
}

export const WalletSelector = ({
  userId,
  totalBalance,
  currency,
  wallets,
}: WalletSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAddWalletModal, setIsOpenAddWalletModal] = useState(false);
  const [idWalletEdit, setIdWalletEdit] = useState<string | null>(null);
  const [idWalletDelete, setIdWalletDelete] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedWalletId = searchParams.get('walletId');
  const selectedWallet = wallets.find((w) => w.id === selectedWalletId) ?? null;

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleSelectWallet = (wallet: Wallet | null) => {
    setIsOpen(false);

    if (pathname === ROUTES.TRANSACTIONS) {
      const params = new URLSearchParams(searchParams.toString());
      if (wallet) params.set('walletId', wallet.id);
      else params.delete('walletId');
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const handleAddWallet = () => {
    setIsOpen(false);
    setIsOpenAddWalletModal(true);
  };

  const handleEditWallet = (id: string) => {
    setIsOpen(false);
    setIdWalletEdit(id);
  };

  const handleCloseEditModal = () => setIdWalletEdit(null);

  const handleDeleteWallet = (id: string) => {
    setIsOpen(false);
    setIdWalletDelete(id);
  };

  const handleConfirmDelete = () => {
    if (!idWalletDelete) return;

    startTransition(async () => {
      const error = await deleteWallet(idWalletDelete, userId);

      setIdWalletDelete(null);

      if (error) {
        return showToast({
          status: 'error',
          title: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
          description: error,
        });
      }

      showToast({
        status: 'success',
        title: SUCCESS_MESSAGES.WALLET_DELETED,
      });
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleCloseAddWalletModal = () => setIsOpenAddWalletModal(false);

  const walletDelete = wallets.find((w) => w.id === idWalletDelete);
  const walletEdit = wallets.find((w) => w.id === idWalletEdit);

  const handleCloseDeleteModal = () => setIdWalletDelete(null);

  return (
    <>
      <div ref={ref} className="relative flex cursor-pointer items-center gap-3">
        {pending ? (
          <WalletSelectorSkeleton />
        ) : (
          <div className="flex items-center gap-3" onClick={handleToggle}>
            <Avatar size="sm" src={IMAGES.TRANSACTION_ICON} />
            <div>
              <div className="flex items-center gap-1">
                <p className="text-sm font-medium text-gray-800">
                  {selectedWallet ? selectedWallet.name : 'Total'}
                </p>
                <ChevronRightIcon className="rotate-90" />
              </div>
              <p className="text-sm font-semibold text-green-600">
                {formatAmount(selectedWallet ? selectedWallet.balance : totalBalance, currency)}
              </p>
            </div>
          </div>
        )}

        {isOpen && (
          <WalletList
            wallets={wallets}
            totalBalance={totalBalance}
            currency={currency}
            selectedWalletId={selectedWallet?.id}
            onAddWallet={handleAddWallet}
            onEditWallet={handleEditWallet}
            onDeleteWallet={handleDeleteWallet}
            onSelectWallet={handleSelectWallet}
          />
        )}
      </div>

      {isOpenAddWalletModal && (
        <Modal isOpen title="Add Wallet" onClose={handleCloseAddWalletModal}>
          <WalletForm userId={userId} showBalance onSubmit={handleCloseAddWalletModal} />
        </Modal>
      )}

      {idWalletEdit && (
        <Modal isOpen title="Edit Wallet" onClose={handleCloseEditModal}>
          <WalletForm
            userId={userId}
            showBalance
            previewData={walletEdit}
            onSubmit={handleCloseEditModal}
          />
        </Modal>
      )}

      {idWalletDelete && (
        <ConfirmModal
          isOpen
          title="Delete Wallet"
          description={`Are you sure you want to delete "${walletDelete?.name}"? All transactions in this wallet will also be deleted. This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseDeleteModal}
        />
      )}
    </>
  );
};
