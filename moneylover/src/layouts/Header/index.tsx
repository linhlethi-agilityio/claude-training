'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Constants
import { ROUTES } from '@/constants';

// Types
import { Category, Wallet } from '@/types';

// Components
import { Button, SearchInput, Modal, WalletSelector, TransactionForm } from '@/components';

interface HeaderProps {
  userId: string;
  totalBalance: number;
  currency: string;
  wallets: Wallet[];
  expenseCategories?: Category[];
  incomeCategories?: Category[];
}

const Header = ({
  userId,
  totalBalance,
  currency,
  wallets,
  expenseCategories = [],
  incomeCategories = [],
}: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleOpenAddTransaction = () => {
    setIsOpen(true);
  };

  const handleCloseAddTransaction = () => {
    setIsOpen(false);
  };

  const handleSubmitTransaction = () => {
    setIsOpen(false);
    router.push(ROUTES.TRANSACTIONS);
  };

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 gap-4">
        <WalletSelector
          userId={userId}
          totalBalance={totalBalance}
          currency={currency}
          wallets={wallets}
        />

        {pathname !== ROUTES.DASHBOARD && (
          <div className="w-full max-w-sm">
            <SearchInput />
          </div>
        )}

        <Button className="shrink-0 uppercase" onClick={handleOpenAddTransaction}>
          Add Transaction
        </Button>
      </header>

      {isOpen && (
        <Modal isOpen title="Add Transaction" onClose={handleCloseAddTransaction}>
          <TransactionForm
            userId={userId}
            wallets={wallets}
            expenseCategories={expenseCategories}
            incomeCategories={incomeCategories}
            onSubmit={handleSubmitTransaction}
          />
        </Modal>
      )}
    </>
  );
};

export default Header;
