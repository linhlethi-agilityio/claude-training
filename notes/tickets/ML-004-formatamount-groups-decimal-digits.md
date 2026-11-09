# ML-004 — `formatAmount` puts thousands separators inside the decimal part

- **Type:** Bug
- **Status:** Open
- **Area:** `moneylover/src/utils/number.ts` (`formatAmount`); used by `WalletItem`, `WalletSelector`, `TransactionItem`, `TransactionList`, `TransactionDetail`, `RecentTransactions`
- **Severity:** Low (amounts are stored as `bigint`, so decimals should not reach the UI today), but the helper disagrees with the whole-number rule from ML-003
- **Related:** ML-003 (same regex problem, fixed in `formatCurrency` / `parseNumber`)

## Summary

`formatAmount` converts the number with `.toString()` and then applies the thousands-separator regex to the whole string, including the digits after the decimal point. It also keeps decimals, while ML-003 decided that amounts are whole numbers.

## Environment

- Commit: `acd94ab` (main)
- Verified with a temporary Jest test (not committed)

## Steps to reproduce

```ts
import { formatAmount } from '@/utils/number';

formatAmount(1234.5678); // "+1,234.5,678 đ"
formatAmount(1234.56);   // "+1,234.56 đ"
formatAmount(-1500, 'USD'); // "-1,500 $"  (correct, for reference)
```

## Expected result

Consistent with ML-003 (whole numbers only):

- `formatAmount(1234.5678)` → `"+1,234 đ"`
- `formatAmount(1234.56)` → `"+1,234 đ"`
- Existing behaviour for whole numbers, signs, `outflow` and currency symbols is unchanged.

## Actual result

- `formatAmount(1234.5678)` → `"+1,234.5,678 đ"` (separator inside the decimal part)
- `formatAmount(1234.56)` → `"+1,234.56 đ"` (decimal kept)

## Notes / hypotheses (to verify, not trusted)

- `Math.abs(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')` matches digit groups after the `.` as well.
- `formatCurrency` in `src/utils/input.ts` already truncates with `Math.trunc` after ML-003; the two helpers duplicate the same regex and could share one implementation.
- Truncating towards zero: `-1234.9` → `-1,234`. Confirm this is acceptable (Q1).

## Open questions for the reporter

1. For negative values with decimals, is truncating towards zero (`-1234.9` → `-1,234`) acceptable, or should it round?
2. Should `formatAmount` and `formatCurrency` share one helper, or is that a separate refactor ticket?

## Acceptance criteria

- [ ] Failing unit tests added to `src/utils/__test__/number.test.ts` for `1234.5678` and `1234.56`.
- [ ] `formatAmount` drops the decimal part; all existing `number.test.ts` cases still pass.
- [ ] No change to callers' output for whole-number amounts (`pnpm test` green, no snapshot updates).
- [ ] Branch is independent of ML-001 (different files), so both can run in parallel worktrees (Day 6).
