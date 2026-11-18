# ML-007 — Add Transaction form gives no validation feedback, and notes have no length limit

- **Type:** Bug (validation + UI)
- **Status:** Open (needs a decision on the note limit, see open questions)
- **Area:** `moneylover/src/components/TransactionForm/index.tsx`, `moneylover/src/components/TransactionItem/index.tsx`, `moneylover/src/actions/transaction.ts`
- **Severity:** Medium (no data loss; confusing UX and a broken page layout)
- **Source:** Manual browser test on 2026-11-18 (Playwright, Edge, local dev server)

## Summary

The Add Transaction form never shows a validation message. An empty or `0` amount is blocked only by a disabled Submit button, with no hint why. The note field has no length limit anywhere (form, server action, DB), so a 5,000-character note is saved, and a long unbroken note overflows the transaction list horizontally.

## Observed in the browser

| Input (category = Food & Drink) | Result | Message shown | Console |
| --- | --- | --- | --- |
| Amount empty | Field is reset to `0` as soon as it is cleared; Submit stays disabled | None | 0 errors |
| Amount `0` | Submit stays disabled | None | 0 errors |
| Amount `1000`, note of 5,000 chars (no spaces) | Submit enabled; transaction saved with the full 5,000-char note | None | 0 errors |

After saving the long note, `/transactions` grows to about 30,400 px wide in a 1,192 px viewport; the note text runs out of the transaction card and the whole page scrolls sideways.

## Evidence (from the code)

- `TransactionForm/index.tsx:33`, `:90-93`: Submit is enabled only when `categoryId` and `amount` are truthy. `0` is falsy, so Submit is disabled, but no `rules` are set on the Amount `Controller`, so `error?.message` is never filled and nothing is shown.
- `TransactionForm/index.tsx:212`: `value={formatCurrency(value)}` with `parseNumber` on change, so an empty field becomes `0` immediately; "empty" and "zero" cannot be told apart.
- `TransactionForm/index.tsx` (Note `Controller`): no `rules`, no `maxLength` on the input.
- `actions/transaction.ts`: `createTransaction` / `updateTransaction` pass `note` straight to the DB with no check.
- `supabase/migrations/003_create_transactions.sql:8`: `note text DEFAULT ''` (unbounded).
- `TransactionItem/index.tsx:38`: `<p className="text-xs text-gray-400">{note}</p>` with no wrapping or truncation classes.

## Steps to reproduce

1. `pnpm dev`, sign in, click **Add Transaction**, pick any category.
2. Clear Amount, or type `0`: Submit stays disabled and no message appears.
3. Type `1000` in Amount and paste a 5,000-character string with no spaces into Note.
4. Submit. The transaction is saved; open **Transactions** and see the page scroll horizontally.

## Expected result

- Amount empty or `0`: an inline message under Amount (e.g. "Amount must be greater than 0"), with `aria-invalid` set.
- Note longer than the agreed limit: blocked in the form with a message, and rejected by the server action too.
- Long notes never break the layout (wrap or truncate in the list).

## Open questions

1. What is the max note length (e.g. 255)?
2. Should the limit also be a DB `CHECK` constraint? That needs a migration, which CLAUDE.md allows only if the ticket says so.
3. When should the amount message show: on blur, on submit attempt, or while Submit stays disabled?
4. In the list, wrap long notes (`break-words`) or truncate to one line (`truncate`) with the full note on the detail page?

## Acceptance criteria

- [ ] Tests: empty / `0` amount shows the amount error message.
- [ ] Tests: a note over the limit shows an error and is not submitted.
- [ ] Server action rejects a note over the limit.
- [ ] A long unbroken note does not make `/transactions` scroll horizontally.

## Test data left behind

The manual test created one 1,000 đ Food & Drink expense on 2026-11-18 with a note starting `LONGNOTE-TEST-` in the local dev account. Delete it from Transactions.
