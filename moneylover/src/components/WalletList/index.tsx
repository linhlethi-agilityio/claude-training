// Types
import { Wallet } from '@/types';

// Constants
import { CURRENCIES } from '@/constants/wallet';

// Components
import { Button, WalletItem } from '@/components';

interface WalletListProps {
  wallets: Wallet[];
  totalBalance: number;
  currency?: string;
  selectedWalletId?: string | null;
  onAddWallet?: () => void;
  onEditWallet?: (id: string) => void;
  onDeleteWallet?: (id: string) => void;
  onSelectWallet?: (wallet: Wallet | null) => void;
}

export const WalletList = ({
  wallets,
  totalBalance,
  currency = CURRENCIES[0].code,
  selectedWalletId,
  onAddWallet,
  onEditWallet,
  onDeleteWallet,
  onSelectWallet,
}: WalletListProps) => {
  const handleClickTotalWallet = () => {
    onSelectWallet?.(null);
  };
  return (
    <div className="absolute left-0 top-full z-50 mt-2 min-w-64 min-h-80 rounded-lg border border-gray-200 bg-white py-1 shadow-lg flex flex-col overflow-visible">
      <WalletItem
        name="Total"
        balance={totalBalance}
        currency={currency}
        isSelected={!selectedWalletId}
        onClick={handleClickTotalWallet}
      />
      {wallets.length > 0 && (
        <p className="px-4 py-2 text-xs font-medium uppercase text-gray-400">Included in Total</p>
      )}
      <div className="scrollbar-thin">
        {wallets.map((wallet) => {
          const { id = '', name = '', balance = 0, currency = '' } = wallet;

          return (
            <WalletItem
              key={id}
              name={name}
              balance={balance}
              currency={currency}
              isSelected={selectedWalletId === id}
              showMenu
              onEdit={() => onEditWallet?.(id)}
              onDelete={() => onDeleteWallet?.(id)}
              onClick={() => onSelectWallet?.(wallet)}
            />
          );
        })}
      </div>
      <Button
        variant="ghost"
        onClick={onAddWallet}
        className="mt-auto w-full justify-start gap-2 rounded-none px-4 py-3 text-sm font-medium text-lime-600 hover:text-lime-600"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime-100 text-lime-600">
          +
        </span>
        Add Wallet
      </Button>
    </div>
  );
};
