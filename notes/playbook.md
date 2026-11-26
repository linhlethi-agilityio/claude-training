# How I work with Claude — Linh Le (Developer)

Full page: https://claude.ai/artifact/BuFAh7qUre7DSgxJJsBCTJ. This file is the short version kept in the repo.

## Flow: one step per tool

| Step | Tool | What I type |
|---|---|---|
| Is the ticket ready? | `ticket-intake` skill | `Is ML-008 ready to build?` |
| Approaches | `brainstorming` skill | `Brainstorm ML-008` |
| Stress-test | `/grill-me` | `/grill-me` |
| Build | `fix-ticket` skill, `pnpm check` until green | `Fix ML-008` |
| Verify | `verifier` subagent (fresh context, fixes nothing) | `Use the verifier on ML-008` |
| Review | `/code-review`, then `review-checklist` triage against `REVIEW.md` | `/code-review` |
| Ship | `/open-pr` (push, PR, CI + Claude review triage) | `/open-pr ML-008` |
| After merge | `/sync-main` | `/sync-main` |

Decisions live in the ticket, never only in chat. I merge on GitHub; Claude never merges.

## Prompts I no longer type

| Old prompt | Replaced by |
|---|---|
| "Fix [ticket] with the fix-ticket skill. Follow the decisions. Plan first." | Skill description triggers on "Fix ML-xxx"; the skill follows the ticket's decisions and shows a plan first. |
| "Triage the findings with the review-checklist skill." | A fixed step in `/open-pr`; the Claude review on every PR follows the same checklist. |
| "Check [story] with the ticket-intake skill." | Skill description triggers on "is it ready to build?". |
| "Use git log and the tickets only, don't invent anything." | Standing rule in CLAUDE.md. |
| "Commit only, don't push." | `git push` needs my approval (local permission set to ask); `/open-pr` is how I ask for a push. |

Rule of thumb: a skill description replaces "use skill X", a skill step replaces a repeated instruction, CLAUDE.md holds standing rules, and permissions, hooks and the GitHub ruleset enforce what must never happen.

## Default task prompt

For anything that isn't a ticket yet:

```
Goal: [what I want and why].
Done when: [checkable criteria, e.g. pnpm check passes, the page shows Y].
Context: [files, constraints, what's out of scope].
Before doing anything, tell me your plan and the riskiest step.
If something is unclear, ask me instead of guessing.
```

## Habits

- **Twice means write it down.** The same mistake twice becomes a CLAUDE.md line or a check; the same explanation twice becomes a skill.
- **Read the risky parts first.** "Summarize the diff and show me the 3 riskiest spots", then I read those spots in full.
- **Evidence, not "tested".** PRs carry the `pnpm check` output and a Merge danger line.
- **Context hygiene:** `/context` when unsure what fills the window, `/compact [what to keep]` mid-task, `/clear` or a new session for unrelated work, a subagent for heavy reading, and a handoff file when a session is full.

## Parallel work

Tickets run in parallel only if they touch different files. ML-006 and ML-007 both changed `actions/transaction.ts`, its test and `TransactionForm`, so ML-006 had to wait for ML-007. Check overlap while brainstorming, then split by layer or file, or order the tickets.

## Guardrails

- Hooks: `block-forbidden` (no `--no-verify`, force push, direct push to `main`, commits on `main`, `jest -u`, `.env*`, `reset --hard`, `clean -f`, `branch -D`), `format-on-edit` (Prettier).
- Git hooks: pre-commit `pnpm check` (typecheck + lint + tests), pre-push build.
- GitHub: `Tests` workflow and Claude review on every PR; ruleset on `main` (PR required, `unit` must pass, no force push).
- Secrets go only into the program that asks for them (browser, `gh secret set`), never into chat.

## Mistakes I don't want to repeat

- Ran `jest -u` in the wrong checkout: check the branch first.
- Merged with untriaged review findings, and a security fix with no review.
- Trusted a "Verified" review finding that named a file that doesn't exist.
- Pasted a token into chat.
- Split two tickets that shared files and called it parallel work.
