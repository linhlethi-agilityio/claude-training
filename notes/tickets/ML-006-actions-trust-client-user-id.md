# ML-006 — Server actions trust the caller's `userId` and change rows by `id` only

- **Type:** Security bug
- **Status:** Open (needs a decision before fixing, see open questions)
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

1. Fix in the app only (session user id + owner filters), or also enable RLS? RLS needs a migration and a Supabase auth mapping, which CLAUDE.md says needs an explicit ticket decision.
2. Should unauthorised calls return a generic error or 404-like "not found"?

## Acceptance criteria

- [ ] Tests: an action called for another user's id does not change data.
- [ ] No action takes `userId` from its arguments.
- [ ] All `.update()` / `.delete()` / single-row reads filter by owner.
