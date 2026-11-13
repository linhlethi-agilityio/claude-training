---
name: review-checklist
description: Review a branch, MR/PR or diff with the team checklist from Day 3 (correctness → tests → readability → security basics → scope). Use when the user asks to review code, an MR or PR, a branch before merge, or to self-review before opening an MR. Also use to triage findings from /code-review or /security-review.
---

# Team review checklist

Review in this order and do not skip a section. A clean section gets one line ("Tests: nothing found").

## 0. Scope the review

- Diff: `git diff origin/main...HEAD` for the current branch, or the MR/PR the user names (`gh pr diff <n>` on GitHub).
- Ticket: the branch name holds the id (`fix/ML-004-...`). Read `notes/tickets/<ID>-*.md`; its acceptance criteria are the spec.
- Read the changed files in full, not only the hunks, and the callers of any changed function.

## 1. Correctness

- Every acceptance criterion is met, or the gap is stated.
- Edge cases: `0`, negative, empty string, `null`/`undefined`, decimals, very large numbers, today/timezone boundaries.
- Amounts are whole numbers (`bigint` in DB, ML-003). Nothing reintroduces decimals or float maths on money.
- Data flow: queries in `libs/`, cached reads in `services/` (`'use cache'` + `cacheTag`), mutations in `actions/` (`'use server'` + `updateTag`). A mutation must `updateTag` every tag that its data is read under.
- Prove suspected bugs before reporting them: run the code (`node -e`, a temporary test) when it is cheap.

## 2. Tests

- New or changed behaviour has a test in `__test__/` next to the code.
- The test fails without the fix (check it, or ask the author how they checked).
- Anything that renders "today" uses `jest.useFakeTimers({ now })`.
- Snapshot changes are explained; a snapshot updated only to go green is a blocker.
- `pnpm lint` and `pnpm test` pass (run them from `moneylover/`).

## 3. Readability and conventions (CLAUDE.md)

- `@/` aliases and barrel `index.ts`, imports grouped under comments (`// Constants`, `// Utils`, ...).
- Named exports, arrow function components, classes merged with `cn()`.
- Clear names, no dead code, no `console.log`, no commented-out code, no duplicated helper where one exists (e.g. number formatting in `utils/`).

## 4. Security basics

- No secrets, keys or real passwords; no `.env*` file except `.env.sample`.
- Server actions do not trust client input: the user id should come from the session (`auth()`), not from a parameter; inputs are validated on the server too (zod schemas in `utils/validation.ts`).
- Supabase queries that read or change user data filter by the owner (`.eq('user_id', ...)`), including update and delete by id.
- No `dangerouslySetInnerHTML` with user data; error messages shown to users do not leak internals.
- Pre-existing issues found here are reported as "existing, out of scope" with a suggested ticket, not fixed in this branch.

## 5. Scope

- Only files the ticket needs. No unrelated refactor or formatting churn.
- No change to `supabase/migrations/` or the schema unless the ticket says so.
- Commits: Conventional Commits with the ticket id, small, test + fix together.
- MR description has What / Why / How tested / Screenshots / Out of scope.

## Output

One list, most severe first. Each item:

- **Severity:** Blocker / Should fix / Nit
- **Where:** `path:line`
- **What and why**, then **Suggested fix** (concrete, small)
- **Status:** Verified (reproduced or run) or Suspected

End with a verdict: **Approve** or **Request changes**, and the test/lint result.

Rules:

- Every comment must be actionable. When reviewing someone else's MR, aim for at least 3 actionable comments, but never invent issues to reach a number.
- When triaging /code-review or /security-review output, mark each finding Confirmed / False positive (with the reason) so false positives can be noted for the retro.
- Do not edit code during a review unless the user asks. Ask before posting comments on GitLab or GitHub.
