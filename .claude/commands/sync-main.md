---
description: Update local main from GitHub after a PR is merged, and list branches to clean up
allowed-tools: Bash(git status:*), Bash(git switch main), Bash(git fetch:*), Bash(git pull --ff-only:*), Bash(git rev-parse:*), Bash(git log:*), Bash(git branch:*), Bash(git worktree list)
---

Bring local `main` up to date with GitHub (`github`, the only remote) after a PR is merged.

1. Run `git status --porcelain`. If the working tree is not clean, stop and list the changed files.
2. `git switch main`, then `git fetch --prune github` and `git pull --ff-only github main`. If the pull is not a fast-forward (local `main` has commits GitHub does not), stop, show `git log --oneline github/main..main`, and ask me what to do. Never force-push, never reset.
3. List local branches already merged into `main` (`git branch --merged main`, excluding `main`) and any worktrees that hold them (`git worktree list`). Suggest the commands to remove them. Do not delete anything yourself.
4. Reply in one short block: the new `main` commit, what came in (`git log --oneline` of the pulled range), branches and worktrees that can be cleaned up.
