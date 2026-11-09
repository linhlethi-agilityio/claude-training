Maintenance pass for the claude-training repo. The app is in `moneylover/` (use pnpm). Follow CLAUDE.md. Work through these in order and stop at the first step that needs action.

1. **Unfinished work.** If this session left a task half done (failing test, unfinished edit), finish it first.

2. **Pull request for the current branch.** Remotes: `origin` = GitLab (graded), `github` = GitHub (used by `gh`).
   - Run `gh pr view --json number,state,mergeable,reviewDecision,comments,reviews` for the current branch.
   - New review comments: address each one with a small commit, then reply on the thread saying what changed. If a comment is unclear, reply with a question instead of guessing.
   - Merge conflict with `main`: `git fetch origin` and rebase onto `origin/main`, resolve, re-run tests. Do not force-push unless I already asked for it in this session.
   - No PR yet, or the branch is `main`: skip to step 3.

3. **Local checks** (there is no CI in this repo). From `moneylover/`, run `pnpm lint` and `pnpm test`. If something fails, find the cause and fix it on the current branch. Never use `jest -u` or `--no-verify` to make it pass.

4. **Nothing pending.** Reply with one line: branch, PR state, test result. Do not start new work.

Rules: never commit to `main`, never merge a PR, never push or delete a branch unless I asked for it earlier in this session. Keep commits small and in Conventional Commits format with the ticket id.
