# Day 10 — Review and quality (Developer track)

## 1. Team review checklist as a skill

- [x] `.claude/skills/review-checklist/SKILL.md`: the Day-3 order (correctness → tests → readability → security basics → scope), with this repo's rules (whole-number amounts, `updateTag`, fake timers, conventions).
- [ ] In a new session: "review this branch" → does Claude pick the skill without naming it?

## 2. `/code-review` on a real branch

- Branch: `fix/ML-004-format-amount-whole-number` (merged as `58af2b3`). `/code-review` at default effort returned 7 findings, all in `utils/number.ts`.
- Triaged with the `review-checklist` skill. Facts checked: amounts are validated `min(0)` (`utils/validation.ts:50`) and stored as `bigint`, the sign comes from `type`, and there is no currency conversion in the app.

| # | Finding | Verdict | Why | Follow-up |
|---|---|---|---|---|
| 1 | `Math.trunc` shows float-drift totals one unit low (use `Math.round`) | False positive | Inputs are whole numbers from `bigint`; sums of integers are exact below 2^53; no conversion code exists. Trunc matches ML-003. | — |
| 2 | `outflow` ignores the amount's own sign | False positive (for this branch) | Pre-existing behaviour, not changed by the diff. Amounts are `>= 0` by schema; the sign comes from `type`. | — |
| 3 | `toString` gives `1e+21` / `-NaN đ` for non-finite or huge values | Confirmed, pre-existing | Checked: `NaN >= 0` is false, so `formatAmount(NaN)` gives `-NaN đ`. `1e21` is not a realistic amount. | ML-005 (fixed) |
| 4 | `-0.5` shows `+0 đ` | False positive | Negative decimals cannot reach the formatter; `+0 đ` matches the existing `formatAmount(0)`. Recorded as an assumption in ML-004. | — |
| 5 | Trunc + grouping regex duplicated with `formatCurrency` | Confirmed, deferred on purpose | ML-004 Q2 kept this out of scope. | ML-005 (fixed) |
| 6 | Fix treats the symptom; non-integers should be stopped upstream | False positive | Upstream already guarantees whole numbers (`bigint`); the formatter is the ticket's scope. | — |
| 7 | `whole < 0` duplicates `!isPositive` in the sign expression | Confirmed, nit | Pre-existing logic, only renamed in the diff. | ML-005 (fixed) |

Signal: 3 of 7 useful (all low severity), 4 false positives. The false positives came from not knowing the domain rules (whole-number `bigint` amounts, sign from `type`), which are in CLAUDE.md and the tickets but not near the code.

## 3. Ultrareview on the seeded-buggy branch

- The lead prepares the branch. I run `/code-review ultra` myself (multi-agent, cloud, billed; Claude cannot start it).

| | `/code-review` | `/code-review ultra` |
|---|---|---|
| Seeded bugs found (x / total) | | |
| False positives | | |
| Time / cost | | |
| Worth it for which branches? | | |

## 4. Security

- [ ] `/security-review` on a branch (it reviews the pending diff, so run it on a feature branch, e.g. the ML-006 fix).
- [ ] Install the `security-guidance` plugin (`/plugin`), note what it adds (hooks / skills) and whether it fires on edits.
- [x] Manual security pass over `actions/` and `libs/` with the `review-checklist` security section → **ML-006** (High if RLS is off):

| Finding | Status | Where |
|---|---|---|
| Actions take `userId` from the caller, not the session | Verified in code | `actions/transaction.ts`, `wallet.ts`, `category.ts` |
| Update/delete/read by `id` with no owner filter | Verified in code | `libs/transactions.ts:63,93`, `libs/wallets.ts:26,32` |
| No RLS policies in migrations; one anon-key client | Verified in code | `src/supabase/migrations/*.sql`, `libs/supabase.ts:21` |
| Another user's rows can be changed | Suspected, not exploited | Repro steps in ML-006 (test users only) |

Lesson: a diff-based review (`/code-review`, `/security-review`) only sees what changed. This issue is in old code, so it needs a whole-area pass or a ticket.

## 5. Exercise result

- [x] Fixed what the review found: ML-005 (findings #3, #5, #7) on `fix/ML-005-format-amount-shared-helper`, test-first (3 failing → 449/449 green, lint + `tsc` clean).
- False positives for the retro (see the table in section 2): #1, #2, #4, #6. Cause: the reviewer did not apply the whole-number / sign-from-`type` rules. Idea: a short comment on `formatAmount` stating the input contract.
- `ultrathink` / `/effort`: where higher effort paid off, where it did not.
