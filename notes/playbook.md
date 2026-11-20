# How I work with Claude — Linh Le (Developer)

Draft from three weeks of training on the `claude-training` repo (21 merged MRs, tickets ML-001 to ML-007). One page.

## My default flow

1. **Ticket first.** Every change starts from a ticket in `notes/tickets/`. Questions go into the ticket's `## Open questions`, never only into chat. Decisions are written next to them before any code.
2. **Plan mode in a fresh worktree.** One session, one worktree, one branch per ticket. I read the plan against the ticket's decisions before approving it.
3. **Test first.** "Write the failing test, show me it fails for the right reason, then fix." Snapshot updates only after I've read each diff.
4. **Review before the MR.** `/code-review`, then triage with the `review-checklist` skill: Confirmed / False positive, then fix, follow-up ticket, or accept. Nothing merges with untriaged findings.
5. **Ship.** Conventional Commits with the ticket id, MR on GitLab, I merge, then `/sync-remotes` to the GitHub mirror.

## Prompts I reuse

- "Fix ML-xxx with the fix-ticket skill. Follow the decisions in the ticket. Plan first."
- "Triage the findings with the review-checklist skill."
- "Check CAP-xxx with the ticket-intake skill." (zero-questions test before building)
- "Use git log and the tickets only, don't invent anything." (release notes, reports)
- "Commit only, don't push."

## Guardrails

- **Hooks enforce, not memory:** `block-forbidden.sh` blocks `--no-verify`, force push, commits on `main`, `jest -u`, adding `.env*`. `format-on-edit.sh` runs Prettier on every edit.
- **Git hooks:** pre-commit runs lint and all tests, pre-push runs the build.
- **Secrets:** I type passwords in the browser myself; `.env.local` never goes into chat or a commit.
- **Push and merge are mine.** Claude commits; I read the diff, push and merge.
- **Facts, not guesses:** reports and notes come from git, tickets and transcripts. If a number isn't real, it's a TODO.

## Mistakes I don't want to repeat

- Ran `jest -u` in the main checkout instead of the worktree → check the branch in the prompt before every command.
- Merged ML-007 with 7 untriaged review findings, and ML-006 with no review.
- Planned two tickets "in parallel" but ran them one after the other.

## Tools that earned their place

| Tool | Use |
|---|---|
| Skills (`fix-ticket`, `review-checklist`, `ticket-intake`) | Team workflow without retyping it |
| Hooks | Guardrails that work even in a session that forgot the rules |
| Playwright MCP | Found ML-007, a bug every unit test missed |
| Worktrees + plan mode | Isolated, reviewable work per ticket |
| `/loop` | Watching an MR while I work on something else (git only, no `glab` yet) |
| Artifacts | Release notes and this playbook, shared by link |
