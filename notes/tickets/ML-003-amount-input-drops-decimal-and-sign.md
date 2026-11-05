# ML-003 — Amount formatting drops the decimal point and minus sign

- **Type:** Bug (needs product clarification)
- **Status:** Open
- **Area:** `src/utils/input.ts` (`formatCurrency`, `parseNumber`); used by `TransactionForm` and `WalletForm`
- **Severity:** High if decimal amounts are allowed (the stored value becomes 100× too large); Low if amounts are whole numbers only

## Summary

`formatCurrency` and `parseNumber` strip every non-digit character with `/\D/g`. For string input, this also removes `.` and `-`, so decimal and negative amounts are silently changed.

## Environment

- Commit: `505bd1a`
- Verified with a temporary Jest test (not committed)

## Steps to reproduce

Unit level:

```ts
formatCurrency('1234.56') // "123,456"
parseNumber('1,234.56')   // 123456
formatCurrency('-1234')   // "1,234"
parseNumber('-500')       // 500
```

UI level (to be confirmed by running the app):

1. Open Add Transaction (or Add Wallet).
2. Type `1234.56` into the Amount field.
3. Look at the displayed value, save, and check the stored amount.

## Expected result

To be decided (see the open questions). For example: `1234.56` → `"1,234.56"` / `1234.56`, or input is limited to whole numbers and the user cannot type `.`.

## Actual result

`1234.56` is shown as `123,456` and parsed as `123456`.

## Related observation (not yet verified)

`formatCurrency(1234.5678)` with a number input probably returns `"1,234.5,678"`, because the regex also groups the digits after the decimal point.

## Open questions for the reporter

1. Which currencies are supported? VND has no minor unit; USD does.
2. Should the Amount field accept decimals at all?
3. Can a wallet's initial balance be negative?
4. Are amounts stored as integers (minor units) or as decimals in Supabase?

## Acceptance criteria (draft, pending answers)

- [ ] Failing unit tests added for decimal and negative input first.
- [ ] `formatCurrency` and `parseNumber` behave as agreed above.
- [ ] Existing tests in `src/utils/__test__/` still pass.
