---
description: Sync main from GitLab (origin) to GitHub after an MR is merged
allowed-tools: Bash(git status:*), Bash(git switch main), Bash(git fetch:*), Bash(git pull --ff-only:*), Bash(git rev-parse:*), Bash(git merge-base:*), Bash(git log:*), Bash(git push github main), Bash(git branch:*)
---

Sync `main` so GitLab (`origin`, source of truth) and GitHub (`github`) point to the same commit.

1. Run `git status --porcelain`. If the working tree is not clean, stop and list the changed files.
2. `git switch main`, then `git fetch origin github --prune` and `git pull --ff-only origin main`. If the pull is not a fast-forward, stop and explain.
3. Compare `git rev-parse main github/main`:
   - Same commit: report "already in sync" and stop.
   - `github/main` is an ancestor of `main` (`git merge-base --is-ancestor github/main main`): run `git push github main`.
   - Otherwise GitHub has commits GitLab does not (someone merged on GitHub). Stop, show `git log --oneline main..github/main`, and ask me what to do. Never force-push.
4. List local branches already merged into `main` (`git branch --merged main`, excluding `main`) and suggest deleting them. Do not delete them yourself.
5. Reply in one short block: commit hash on both remotes, what was pushed, branches that can be cleaned up.
