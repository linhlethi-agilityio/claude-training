---
description: Push the current branch to GitHub, open a pull request, and triage the CI and Claude review results
argument-hint: "[ticket id, e.g. ML-008]"
allowed-tools: Bash(git status:*), Bash(git branch:*), Bash(git log:*), Bash(git diff:*), Bash(git push -u github:*), Bash(gh pr create:*), Bash(gh pr view:*), Bash(gh pr checks:*)
---

Open a pull request for the current branch. Running this command is my request to push this branch (never `main`).

1. Check: the branch is not `main`, `git status --porcelain` is clean, and the branch has commits that `github/main` doesn't. Otherwise stop and say why.
2. Check the review step happened. If this session has `/code-review` findings that are not triaged yet, triage them first with the `review-checklist` skill and show the result. If there is no sign that `/code-review` ran on this branch, say so and ask whether to continue without it; don't skip it silently.
3. For a ticket branch, run the `verifier` subagent on the ticket if it hasn't run since the last commit. Any ❌ or Mismatch: stop and show the report.
4. `git push -u github <branch>`.
5. `gh pr create --repo linhlethi-agilityio/claude-training --base main --head <branch>` with a title in Conventional Commits form (with the ticket id from $ARGUMENTS or the branch name) and an English description:
   - **What / Why**, with before/after examples.
   - **Evidence:** the `pnpm check` summary lines and the verifier's Saw section, not just "tested".
   - **Merge danger:** what could break after merge (shared files, data already in the DB, config), or "none".
   - **Screenshots** (UI changes only) and **Out of scope**.
   End the description with the Claude Code attribution line. Tell me to edit it by hand.
6. Wait for the checks (`gh pr checks <n> --watch`), then read the Claude review: the PR comments (`gh pr view <n> --comments`) and the inline comments (`gh api repos/linhlethi-agilityio/claude-training/pulls/<n>/comments`, read only; it is not pre-allowed, so I approve it). Triage every finding with `review-checklist`, checking each one in the code, including the ones marked "Verified".
7. Reply in one short block: PR link, check results, and the triage table (finding, Confirmed / False positive, proposed action). Do not fix anything, reply on GitHub, or merge unless I ask. I merge.
