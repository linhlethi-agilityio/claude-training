# Day 15 — Review, merge, demo (Final checkpoint)

I work solo on the Developer track, so the cross-functional parts (QA, BA) are done as self-checks and written down as such.

## 0. Day 14 leftovers (finish first)

- [ ] Push `fix/sync-remotes-fetch` (`53de391`, `git fetch --multiple --prune origin github`), MR, merge, then run `/sync-remotes` to test the fixed command.
- [ ] `/code-review high 2260fec..main` (covers ML-006, which skipped review) → triage with `review-checklist`.
- [ ] Fix the top 2–3 confirmed findings with tests in one MR.
- [ ] Write ticket ML-008 (legacy notes longer than 255 chars can't be edited).
- [ ] Remove old worktrees: `release-notes-main-f3f391`, `sync-remotes-fetch-fix-e0a3d8` (after its MR merges).

## 1. Morning: review and merge

| Plan item | What I do (solo) | Evidence |
|---|---|---|
| Dev reviews QA's test code | Review the test code added in ML-006 (`actions/__test__`, `libs/__test__`) with the `review-checklist` skill, tests section only | TODO |
| QA reviews a dev MR | Self-review of the review-follow-ups MR before opening it | TODO: MR !__ |
| BA checks merged behavior against acceptance criteria | Walk ML-006 and ML-007 criteria in the running app (Playwright MCP). Gaps become same-day tickets | TODO: open criterion "no sideways scroll on `/transactions`" |
| Merge, tag a release | Tag `main` after the merges: `git tag -a v1.0.0 -m "Capstone release"`, push the tag to GitLab, then GitHub | TODO: tag + commit |
| Run the deploy | No deploy target in this repo (no Vercel/CI config). Production build checked locally with `pnpm build` (pre-push hook) | TODO: build result |
| Remote Control demo | `/rc` in a Desktop session, open it on the phone, approve one permission prompt and send one steering message | TODO: screenshot |
| Dispatch | Start a Code session from the phone (Pro plan), get the push alert when it finishes | TODO: screenshot, or "not available on my plan" |

## 2. Afternoon: demo (10 minutes, the flow, not slides)

Story: **ML-007, from a browser check to shipped.**

| Min | Step | Show |
|---|---|---|
| 1 | Bug found | Day 11 Playwright check: 5,000-char note, page 30,400 px wide → ticket ML-007 (!16) |
| 2 | Questions before code | Open questions in the ticket, decisions recorded (!18), zero questions asked in chat |
| 2 | Plan | Plan mode in a worktree; plan checked against Q1–Q4 before approving |
| 1 | Build + tests | Test-first; 5 intended snapshot changes; my `jest -u` wrong-folder mistake |
| 2 | Review | `/code-review`: 7 findings → triage table (Day 14 notes); #1 becomes ML-008 |
| 1 | Shipped | MR !19 merged, `/sync-remotes`, release notes artifact, `/loop` watching MR !21 |
| 1 | Guardrails | Hooks blocking `--no-verify` / commit on `main`; Prettier on edit |

## 3. Retro: what to standardize

Proposed repo issues (owner: Linh Le unless the team picks someone else):

| # | Issue | Type |
|---|---|---|
| 1 | `fix-ticket` skill: triage `/code-review` findings before opening the MR (ML-007 merged with 7 untriaged findings, ML-006 with no review) | skill |
| 2 | `.claude/loop.md` uses `gh` (GitHub), but MRs live on GitLab: switch to git-only checks or `glab` once we have a token | loop |
| 3 | Worktree setup: a script or hook that runs `pnpm install` and copies `.env.local` into a new worktree | hook |
| 4 | CLAUDE.md: "check the branch in the prompt before running commands in a worktree" | CLAUDE.md |
| 5 | `block-forbidden` hook checks the branch before the command runs; document `git switch -c` as its own command | hook/docs |
| 6 | Desktop names branches `claude/...` and commits without the ticket id: add the rule to the prompt template | convention |
| 7 | CI runner on GitLab so the regression suite runs on every MR, not only in local git hooks | CI |

## 4. Personal playbook

- Published: https://claude.ai/artifact/BuFAh7qUre7DSgxJJsBCTJ (short version in [`notes/playbook.md`](playbook.md)).

### Lead feedback on the playbook (Phuong, 26 Nov)

| Feedback | What I found | Change |
|---|---|---|
| Which prompts can I stop typing, and how? | All 5. Two were already covered by skill descriptions; "don't invent" was not in CLAUDE.md; "don't push" was only advice because my local permissions allowed `git push`. | Skill steps, a CLAUDE.md rule, `git push` set to ask, `/open-pr` command |
| The tickets waited on each other because of how I split them | ML-006 and ML-007 both changed `actions/transaction.ts`, its test and `TransactionForm`. | CLAUDE.md rule: check file overlap before parallel work; dependency check in `brainstorming` and `grilling` |
| Use brainstorming and grill-me for planning | Not installed. `brainstorming` comes from obra/superpowers, `grill-me` from mattpocock/skills (both MIT). | Added to `.claude/skills/` (brainstorming adapted, grill-me as is), with `THIRD_PARTY_NOTICES.md` |
| fix-ticket does too much | It had 7 steps, from deciding to opening the PR. | Cut to build only; deciding moved to brainstorming / grill-me, the PR to `/open-pr` |

## Final checkpoint: company-ready

| Requirement | Evidence |
|---|---|
| Capstone shipped end to end | ML-007: ticket (!16) → decisions (!18) → plan + build (!19) → review → release notes → synced. ML-006 the same way (!15 → !18 → !20). The practice brief was not built (no lead brief). |
| Day 3 checklist | TODO: tick against the Day 3 list. Candidate evidence: first ticket fixed test-first via MR (ML-003, !2) |
| Day 6 checklist | TODO: tick against the Day 6 list. Candidate evidence: CLAUDE.md (!3), `loop.md` (!4), ML-001 fixed (!5) |
| Day 11 checklist (Checkpoint 3) | Green, see `notes/day-11.md`: skills !6/!10/!13, hooks !9, MCP !8/!16, review acted on !11→!12→!14, role day !16 |

Totals on `main` before Day 15: 21 merged MRs, 7 tickets (ML-001 to ML-007), 3 skills, 1 command, 2 hooks, 1 MCP server, 491 tests passing.

## Learnings

- TODO
