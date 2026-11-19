# Day 14 — Review, merge and follow-ups (Developer)

## ML-007: `/code-review` findings

`/code-review` on the ML-007 branch reported 7 findings. Triage with the `review-checklist` skill:

| # | Finding | Verdict | Action |
|---|---|---|---|
| 1 | Existing transactions with a note longer than 255 chars cannot be edited any more (the new form and server check reject the old note) | Confirmed (e.g. the `LONGNOTE-TEST-` row, 5,000 chars) | Not fixed in ML-007; follow-up ticket ML-008 |
| 2–7 | TODO: copy from the review output | TODO | TODO |

## ML-006: security fix

| Item | Result |
|---|---|
| Commits | `3a51c18` fix(ML-006): read user from session and filter writes by owner · `658b15d` docs(ML-006): mark ticket fixed and record decisions |
| Merged | `a019919` into `main` on GitLab, synced to GitHub (`/sync-remotes`) |
| Files | 22 files, +650 / −233 (actions, libs, services, forms and their tests) |
| Behaviour | Actions read the user id from `auth()`; no `userId` parameters; update/delete/single reads filter by `id` and `user_id`; no session or not-your-row → generic `SOMETHING_WENT_WRONG` |
| Not done | RLS, ownership checks on `walletId` / `categoryId` / `parentId`, end-to-end check with two test users (all listed in the ticket as follow-ups) |
| `/code-review ultra` | TODO: run or not, findings, what I changed |
| Time spent | TODO |

ML-007 merged first; ML-006 was then updated on top of `main` before its MR merged (both touched `actions/transaction.ts`).

## Numbers on `main` after both merges

- Tests: 53 suites, 491 passed (was 449 before ML-006/ML-007), 43 snapshots.

## Open follow-ups

- [ ] **ML-008**: legacy notes longer than 255 chars can't be edited. Options: truncate on load, allow an unchanged legacy note, or clean up the data. Ticket not written yet.
- [ ] RLS ticket (ML-006 Q1).
- [ ] Ownership checks on references sent by the client (ML-006 out of scope).
- [ ] ML-007 acceptance criterion still open: check in the browser that `/transactions` no longer scrolls sideways.
- [ ] Delete the `LONGNOTE-TEST-` test transaction.
- [ ] Clean up old worktrees and merged branches.

## Learnings

- TODO
