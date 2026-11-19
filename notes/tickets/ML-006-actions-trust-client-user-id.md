# ML-006 — Server actions trust the caller's `userId` and change rows by `id` only

- **Type:** Security bug
- **Status:** Fixed on branch `fix/ML-006-actions-session-user-id`
- **Area:** `moneylover/src/actions/` (`transaction.ts`, `wallet.ts`, `category.ts`), `moneylover/src/libs/` (`transactions.ts`, `wallets.ts`, `categories.ts`)
- **Severity:** High if row level security (RLS) is off in the Supabase project; Low if RLS is on and tied to the user
- **Source:** Day 10 security review (manual, while writing the `review-checklist` skill)

## Summary

Server actions receive `userId` as a parameter from the client instead of reading it from the session (`auth()`). Update and delete queries filter by `id` only, never by owner. The Supabase client uses the anon key on the server, and the migrations in `src/supabase/migrations/` define no RLS policies. If RLS is also off in the hosted project, a signed-in user who knows (or guesses) another row's id can change or delete another user's transactions and wallets.

## Evidence (from the code)

- `actions/transaction.ts`: `updateTransaction(id, userId, data)` and `deleteTransaction(id, userId)` pass `id` straight to `editTransaction` / `removeTransaction`; `userId` is only used for cache tags.
- `libs/transactions.ts:63`: `supabase.from('transactions').delete().eq('id', id)` (no `user_id` filter). Same for update (`:93`), and `libs/wallets.ts:26` / `:32`.
- `fetchTransactionDetail(id)` is a server action that returns any transaction by id.
- `libs/supabase.ts:21`: one shared client with the anon key; no per-user Supabase session.
- `grep -niE "row level|policy|auth.uid"` over `src/supabase/migrations/*.sql`: no matches.

## Not verified

- Whether RLS is enabled in the hosted Supabase project (Dashboard → Table editor → RLS). Even if it is, with the anon key and NextAuth sessions there is no `auth.uid()` to tie a policy to a user.
- An end-to-end exploit (two test users, user B deletes user A's transaction by id). Do this with throwaway test users only.

## Steps to reproduce (to run with test users)

1. Sign in as test user A, create a transaction, note its id (Transactions → detail URL or network tab).
2. Sign in as test user B in another browser.
3. Call the delete action for A's id (e.g. from B's session, via the same request the delete button sends, with A's id).
4. Expected: refused. Suspected actual: A's transaction is deleted.

## Expected result

- Actions read the user id from the session, never from parameters.
- Every update/delete/read by id also filters by `user_id` (or wallet ownership).

## Open questions

- [x] Q1. Fix in the app only (session user id + owner filters), or also enable RLS? RLS needs a migration and a Supabase auth mapping, which CLAUDE.md says needs an explicit ticket decision.
  - **Decision:** App only. Actions read the user id from `auth()`; every update, delete and single-row read filters by `user_id`. No migration in this ticket. RLS becomes a separate ticket, because it needs a Supabase auth mapping for NextAuth users.
- [x] Q2. Should unauthorised calls return a generic error or 404-like "not found"?
  - **Decision:** Return the generic `ERROR_MESSAGES.SOMETHING_WENT_WRONG` and change nothing. No session → same generic error. Do not reveal whether the id exists.

## Decision

Fixed in the app only, following Q1 and Q2. No migration, schema or RLS change.

- Every transaction, wallet and category action reads the user id with `(await auth())?.user?.id`. No session → `ERROR_MESSAGES.SOMETHING_WENT_WRONG` and no lib call.
- `userId` / `user_id` is removed from every action's parameters. A client that still sends one is ignored (covered by tests).
- Libs filter by `id` **and** `user_id` on `editTransaction`, `removeTransaction`, `getTransactionById`, `editWallet`, `removeWallet`, `editCategory` (including the sub-category re-parent query) and `removeCategory`. Update/delete add `.select('id')` and return `found`. `found: false` (row missing or owned by someone else) → the action returns the generic error and skips `updateTag`, so it does not reveal whether the id exists.
- `fetchTransactionDetail` returns `null` without a session and only reads the caller's own row.
- Assumption: real database errors still return `error.message`, as before. Only the "no session" and "not your row" cases use the generic message.
- Assumption: `services/getTransactionDetailById` has no callers. It now takes `userId` so it keeps compiling with the new lib signature.
- Assumption: the `userId` prop on `TransactionForm`, `WalletForm` and `CategoryForm` is now unused but kept (optional, marked) to avoid a cascade through `Header`, the list components and `ui/` pages. Remove it in a cleanup ticket.

### Out of scope (follow-ups)

- **Cross-user references on create/update:** `walletId`, `categoryId` and `parentId` still come from the client and are not checked for ownership, so a user could attach their own transaction to another user's wallet or category. This needs ownership checks and its own ticket.
- **RLS:** needs a Supabase auth mapping for NextAuth users (see Q1).
- **End-to-end exploit check** with two throwaway test users was not run.

## Acceptance criteria

- [x] Tests: an action called for another user's id does not change data. (Unit level: libs filter by `user_id`, and actions return the generic error when no owned row matches. Not checked end to end against Supabase.)
- [x] No action takes `userId` from its arguments.
- [x] All `.update()` / `.delete()` / single-row reads filter by owner.
