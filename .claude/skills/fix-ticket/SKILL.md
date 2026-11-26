---
name: fix-ticket
description: Build the fix for a ticket from notes/tickets/ (e.g. ML-004) whose decisions are already written - branch, failing test first, minimal fix, verify, update the ticket, commit. Use when the user asks to fix, implement or work on an ML-xxx ticket.
---

# Fix a ticket

Build only. Deciding what to build happens before (`ticket-intake`, `brainstorming`, `/grill-me`); review and the pull request happen after (`/code-review` + `review-checklist`, then `/open-pr`).

## 1. Check the ticket is ready

- Read the ticket in `notes/tickets/<ID>-*.md` and the files it names.
- Every open question must have a **Decision:** line. Follow the decisions; never re-decide them. If one is missing, or the approach is still open, stop and suggest the `brainstorming` skill or `/grill-me` instead of guessing.
- Reproduce the bug first (a temporary test, `pnpm build` or the UI). Don't trust the ticket's hypotheses until you have run them.
- Show a short plan: files to change, the failing test, how you'll verify. Wait for approval.

## 2. Branch

`git switch -c fix/<ID>-<short-slug>` from an up-to-date `main`, as its own command. Never work on `main`.

## 3. Failing test, then fix

- Add the test next to the code in `__test__/`. Run only that file (`pnpm jest <path>`) and confirm it fails **for the right reason**.
- Make the smallest fix that passes it. No unrelated refactoring.
- Anything that depends on "today" needs `jest.useFakeTimers({ now })`. Never run `jest -u` to make a snapshot pass; show the snapshot diff and let the user decide.

## 4. Verify

From `moneylover/`: `pnpm check` (typecheck + lint + tests) until it passes, plus `pnpm build` if the change touches config, env or server code. In a worktree, run `pnpm install` and copy `.env.local` from the main checkout first (gitignored; never commit it).

## 5. Update the ticket and commit

- Ticket: `Status` → `Fixed on branch fix/<ID>-...`; tick only the acceptance criteria you verified.
- Commits (Conventional Commits, never `--no-verify`): `fix(<ID>): <what changed>` with its test, then `docs(<ID>): <ticket update>`.

Then tell the user the next step: the `verifier` subagent on the ticket, `/code-review`, triage with `review-checklist`, and `/open-pr` when they want to push.
