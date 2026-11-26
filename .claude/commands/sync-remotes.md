---
description: Sync main from GitHub (source of truth) to GitLab after a PR is merged
allowed-tools: Bash(git status:*), Bash(git switch main), Bash(git fetch:*), Bash(git pull --ff-only:*), Bash(git rev-parse:*), Bash(git merge-base:*), Bash(git log:*), Bash(git push origin main), Bash(git branch:*)
---

Sync `main` so GitHub (`github`, source of truth) and GitLab (`origin`, mirror for the lead) point to the same commit.

1. Run `git status --porcelain`. If the working tree is not clean, stop and list the changed files.
2. `git switch main`, then `git fetch --multiple --prune origin github` and `git pull --ff-only github main`. If the pull is not a fast-forward, stop and explain.
3. Compare `git rev-parse main origin/main`:
   - Same commit: report "already in sync" and stop.
   - `origin/main` is an ancestor of `main` (`git merge-base --is-ancestor origin/main main`): run `git push origin main`.
   - Otherwise GitLab has commits GitHub does not (someone merged on GitLab). Stop, show `git log --oneline main..origin/main`, and ask me what to do. Never force-push.
4. List local branches already merged into `main` (`git branch --merged main`, excluding `main`) and suggest deleting them. Do not delete them yourself.
5. Reply in one short block: commit hash on both remotes, what was pushed, branches that can be cleaned up.
