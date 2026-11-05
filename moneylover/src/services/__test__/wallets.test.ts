// Mocks
import { MOCK_WALLETS } from '@/mocks';

// Services
import { getWalletsInfo } from '@/services/wallets';

jest.mock('@/libs', () => ({
  getWallets: jest.fn(),
}));

const { getWallets } = jest.requireMock('@/libs');

describe('getWalletsInfo', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns wallets, totalBalance and currency', async () => {
    getWallets.mockResolvedValue(MOCK_WALLETS);
    const result = await getWalletsInfo('user-1');
    expect(result.wallets).toEqual(MOCK_WALLETS);
    expect(result.totalBalance).toBe(6000200);
    expect(result.currency).toBe('VND');
  });

  it('calls getWallets with userId', async () => {
    getWallets.mockResolvedValue(MOCK_WALLETS);
    await getWalletsInfo('user-1');
    expect(getWallets).toHaveBeenCalledWith('user-1');
  });

  it('returns totalBalance as 0 when wallets are empty', async () => {
    getWallets.mockResolvedValue([]);
    const result = await getWalletsInfo('user-1');
    expect(result.totalBalance).toBe(0);
  });

  it('returns undefined currency when wallets are empty', async () => {
    getWallets.mockResolvedValue([]);
    const result = await getWalletsInfo('user-1');
    expect(result.currency).toBeUndefined();
  });

  it('sums all wallet balances correctly', async () => {
    getWallets.mockResolvedValue(MOCK_WALLETS);
    const { totalBalance } = await getWalletsInfo('user-1');
    const expected = MOCK_WALLETS.reduce((sum, w) => sum + w.balance, 0);
    expect(totalBalance).toBe(expected);
  });
});
