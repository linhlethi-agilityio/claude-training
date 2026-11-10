---
name: fix-ticket
description: Fix a bug ticket from notes/tickets/ (e.g. ML-004) using the team workflow - plan, branch, failing test first, minimal fix, verify, update the ticket, open an MR. Use when the user asks to fix, implement or work on an ML-xxx ticket.
---

# Fix a ticket

Follow these steps in order. Stop and ask the user when a step says so.

## 1. Read and plan

- Read the ticket in `notes/tickets/<ID>-*.md` and the files it names.
- Reproduce the bug first (unit level with a temporary test, or `pnpm build` / the UI). Do not trust the ticket's hypotheses until you have run them.
- Answer each open question with the smallest reasonable choice and say it is an assumption. If an answer changes the DB schema, `supabase/migrations/`, or more than ~3 files, stop and ask.
- Present the plan: files to change, the failing test, how you will verify. Wait for approval.

## 2. Branch

- `git switch -c fix/<ID>-<short-slug>` from an up-to-date `main`. Never work on `main`.

## 3. Failing test, then fix

- Add the test next to the code in `__test__/`. Run only that file (`pnpm jest <path>`) and confirm it fails **for the right reason**. Record the failure message.
- Make the smallest fix that passes it. Do not refactor unrelated code.
- Anything that depends on "today" needs `jest.useFakeTimers({ now })`. Never run `jest -u` to make a snapshot pass.

## 4. Verify

From `moneylover/`:

- `pnpm test` (all green) and `pnpm lint` (no warnings).
- `pnpm build` if the change touches config, env, or server code. In a worktree, copy `.env.local` from the main checkout first (it is gitignored; never commit it).

## 5. Update the ticket

In the ticket file: set `Status` to `Fixed on branch fix/<ID>-...`, add a short "Decision" section for the assumptions you made, and tick the acceptance criteria that are met. Leave unchecked anything you did not verify (e.g. UI checks).

## 6. Commit

Conventional Commits with the ticket id, small commits:

- `fix(<ID>): <what changed>` (fix + its test together, because the pre-commit hook runs all tests)
- `docs(<ID>): <ticket update>`

Never use `--no-verify`.

## 7. Merge request

Only when the user asks to push:

- GitLab (graded): `git push -u origin <branch> -o merge_request.create -o merge_request.target=main`
- GitHub (optional, for `gh`/loop): `git push github <branch>`, then `gh pr create`.

Write the description in English: **What / Why / How tested / Screenshots / Out of scope**, with before/after examples and the test counts. Tell the user to edit it by hand. Never merge; merging happens on GitLab only.
