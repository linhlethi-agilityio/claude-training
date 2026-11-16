# ML-005 — `formatAmount` duplicates `formatCurrency` and prints `-NaN đ`

- **Type:** Refactor / Bug (low)
- **Status:** Open
- **Area:** `moneylover/src/utils/number.ts` (`formatAmount`), `moneylover/src/utils/input.ts` (`formatCurrency`)
- **Source:** `/code-review` of ML-004 (Day 10), findings #3, #5, #7
- **Related:** ML-003, ML-004

## Summary

After ML-004, `formatAmount` and `formatCurrency` both truncate and apply the same thousands-separator regex. Two copies of one rule caused ML-003 and ML-004. `formatAmount` also prints `-NaN đ` for a non-finite input, and its sign expression checks the same condition twice.

## Steps to reproduce

```ts
import { formatAmount } from '@/utils/number';

formatAmount(NaN); // "-NaN đ"
formatAmount(Infinity); // "+Infinity đ"
```

## Expected result

- One helper groups whole-number digits; `formatAmount` uses it.
- Non-finite input shows `0` (or a placeholder such as `—`, see Q1) instead of `NaN` / `Infinity`.
- The sign is computed once: `!isPositive ? '-' : showSign ? '+' : ''`.
- Output for every existing test case is unchanged.

## Open questions

1. Non-finite input: show `0 đ` or `— đ`?

## Acceptance criteria

- [ ] Failing tests for `NaN` and `Infinity` in `src/utils/__test__/number.test.ts`.
- [ ] `formatAmount` uses the shared grouping helper; no duplicated regex.
- [ ] `pnpm test` green with no snapshot updates; `pnpm lint` clean.
