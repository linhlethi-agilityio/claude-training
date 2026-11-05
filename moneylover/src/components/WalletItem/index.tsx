// Constants
import { CURRENCIES, IMAGES } from '@/constants';

// Icons
import { CheckIcon } from '@/icons';

// Utils
import { formatAmount } from '@/utils';

// Components
import { Avatar, MenuActions } from '@/components';

interface WalletItemProps {
  name: string;
  balance: number;
  currency?: string;
  showMenu?: boolean;
  showBalance?: boolean;
  isSelected?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export const WalletItem = ({
  name,
  balance,
  currency = CURRENCIES[0].code,
  showMenu = false,
  showBalance = false,
  isSelected = false,
  onEdit,
  onDelete,
  onClick,
}: WalletItemProps) => (
  <div
    className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 cursor-pointer hover:bg-gray-50"
    onClick={onClick}
  >
    <Avatar size="sm" src={IMAGES.TRANSACTION_ICON} />
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-900">{name}</p>
      {!showBalance && (
        <p className="text-xs text-gray-500">{formatAmount(balance, currency, false)}</p>
      )}
    </div>

    {showBalance && (
      <p className="text-sm font-semibold text-gray-900">
        {formatAmount(balance, currency, false)}
      </p>
    )}
    {isSelected && <CheckIcon />}
    {showMenu && <MenuActions onEdit={onEdit} onDelete={onDelete} />}
  </div>
);
