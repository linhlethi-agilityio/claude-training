# Day 13 — Plan mode and worktrees (Developer)

## What I did

- Built ML-007 (transaction form validation) in its own Desktop worktree session, in plan mode: read the plan, checked it against the ticket decisions, then approved.
- Built ML-006 (security: actions trust the client's `userId`) in a second worktree session, also in plan mode.
- The plan was to run both in parallel. In practice they ran one after the other: the ML-006 session started at 17:30, after ML-007 was merged at 17:25. ML-006 therefore branched from the new `main` and had no conflict to resolve.
- Each worktree needed its own `pnpm install` and a copy of `.env.local` before tests and the dev server worked.

## ML-007 result

| Item | Result |
|---|---|
| Commits | `94ff950` fix(ML-007): validate amount and note length in transaction form · `78fe1ff` docs(ML-007): mark ticket fixed and record decisions |
| Merged | `52f7fdb` into `main` on GitLab, synced to GitHub |
| Files | 16 files, +129 / −24 |
| Behaviour | Amount `0` / empty shows "Amount must be greater than 0" on blur; note max 255 chars (shared `NOTE_MAX_LENGTH`, form `maxLength`, server action check); long notes truncate in the list, wrap on the detail page |
| Snapshots | 5 snapshot files updated; every diff is one of the intended classes (`truncate`, `min-w-0`, `break-words`) or `maxlength="255"` |
| Time spent | Session open 14:39–17:27 (about 2 h 50 min wall clock). Most of it was waiting on the snapshot step (14:47 → 17:23), not active work. |

## Mistake: `jest -u` in the wrong folder

The 5 snapshot failures were in the ML-007 worktree, but I ran `pnpm jest -u` in the main checkout (branch `main`). Result: 449 passed, nothing updated, because `main` had no ML-007 code yet. Running it again inside `.claude/worktrees/ml-007-.../moneylover` updated the 5 snapshots.

Lesson: with several worktrees open, check the branch in the shell prompt before every command. If it says `main`, I'm in the wrong place.

## Learnings

- Plan mode is worth it for tickets with decisions in them: I could check the plan against Q1–Q4 before any code was written.
- Worktrees are not free: each one needs `pnpm install`, its own `.env.local`, and a terminal/IDE opened in the right folder.
- Running two worktrees "in parallel" only helps if I actually start the second session while the first one waits on me. I didn't, so the parallel part of the day is still to practise.
