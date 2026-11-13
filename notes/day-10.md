# Day 10 — Review and quality (Developer track)

## 1. Team review checklist as a skill

- [x] `.claude/skills/review-checklist/SKILL.md`: the Day-3 order (correctness → tests → readability → security basics → scope), with this repo's rules (whole-number amounts, `updateTag`, fake timers, conventions).
- [ ] In a new session: "review this branch" → does Claude pick the skill without naming it?

## 2. `/code-review` on a real branch

- Branch: `fix/ML-004-...` (ML-004, `formatAmount`).
- Run `/code-review` (default effort), then ask Claude to triage the findings with the review checklist.

| Finding | Confirmed / False positive | Why | Fixed in commit |
|---|---|---|---|
| | | | |

## 3. Ultrareview on the seeded-buggy branch

- The lead prepares the branch. I run `/code-review ultra` myself (multi-agent, cloud, billed; Claude cannot start it).

| | `/code-review` | `/code-review ultra` |
|---|---|---|
| Seeded bugs found (x / total) | | |
| False positives | | |
| Time / cost | | |
| Worth it for which branches? | | |

## 4. Security

- [ ] `/security-review` on the branch.
- [ ] Install the `security-guidance` plugin (`/plugin`), note what it adds (hooks / skills) and whether it fires on edits.
- Known existing issue (found while writing the checklist, out of scope): server actions in `moneylover/src/actions/` take `userId` from the caller instead of the session, and update/delete by `id` without an owner filter. Candidate ticket.

## 5. Exercise result

- [ ] Fixed what the review found; MR green (pre-commit lint + tests, pre-push build).
- False positives for the retro:
  -
- `ultrathink` / `/effort`: where higher effort paid off, where it did not.
