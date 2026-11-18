# Day 11 — Role day (web) and Developer Checkpoint 3

## Role day: verify the running app from a session

- Setup: `pnpm dev`, a new Desktop Code session (worktree), sign-in typed by me in the browser window (test account), never in chat.
- Claude in Chrome: not run. Chrome is not installed on this machine (only Edge), so the extension could not connect; the session reported it and offered the built-in browser instead.
- Ran the check with the Playwright MCP (Edge): filled Add Transaction with invalid values and read the console.

| Input | Result | Message | Console |
|---|---|---|---|
| Amount empty | Reset to `0` at once; Submit disabled | None | 0 errors |
| Amount `0` | Submit disabled | None | 0 errors |
| Amount `1000` + 5,000-char note | Saved; `/transactions` grows to ~30,400 px wide | None | 0 errors |

- Result: bug filed reproduce-ready as **ML-007** (MR !16): steps, browser evidence, `file:line` evidence, open questions, acceptance criteria.
- Test data left in the dev account (note starting `LONGNOTE-TEST-`): delete it.

## Checkpoint 3 (Developer)

| Requirement | Evidence |
|---|---|
| One skill + one hook merged | Skills `fix-ticket` (!6), `review-checklist` (!10), `ticket-intake` (!13); hooks `block-forbidden` + `format-on-edit` (!9) |
| One MCP tool used end-to-end | Playwright MCP verified ML-003 in the UI (!8) and found ML-007 (!16) |
| One `/code-review` report acted on | `/code-review` on ML-004 (!11) → triage (!12) → ML-005 fixed test-first (!14) |
| Role-day exercise done | Browser check of Add Transaction → ML-007 (!16) |

## Learnings

- A fresh worktree has no `node_modules` or `.env.local`: the pre-commit and pre-push hooks fail until `pnpm install` and copying `.env.local`.
- Desktop names worktree branches `claude/...` and writes commit messages without the ticket id; ask it to follow the repo conventions before pushing.
- The browser check found a UX bug that unit tests could not: every test passed while the form gave no feedback.
- The `block-forbidden` hook checks the branch before the command runs, so `git switch -c x && git commit` on `main` is blocked; create the branch in a separate command.
