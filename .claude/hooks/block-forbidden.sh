#!/usr/bin/env bash
# PreToolUse hook (Bash): block commands that CLAUDE.md "Never do" forbids.
# Exit 2 = block the call; the message on stderr goes back to Claude.
set -euo pipefail

input=$(cat)
cmd=$(jq -r '.tool_input.command // empty' <<<"$input")
cwd=$(jq -r '.cwd // empty' <<<"$input")
[ -z "$cmd" ] && exit 0

block() {
  echo "Blocked by .claude/hooks/block-forbidden.sh: $1" >&2
  exit 2
}

has() { grep -Eq -- "$1" <<<"$cmd"; }

S='(^|[[:space:];&|(])' # start of a word
E='([[:space:];&|)]|$)' # end of a word

has "${S}--no-verify${E}" && block "--no-verify skips the lint/test/build hooks. Fix the failure instead."
has "${S}git[[:space:]]+push[[:space:]](.*[[:space:]])?(-f|--force[^[:space:]]*)${E}" && block "never force-push."
has "${S}git[[:space:]]+push[[:space:]]+(-[^[:space:]]+[[:space:]]+)*origin[[:space:]]+([^[:space:]]+:)?main${E}" &&
  block "main on GitLab only changes through a merged MR."
has "${S}(jest|pnpm[[:space:]]+(test|jest))[[:space:]](.*[[:space:]])?(-u|--updateSnapshot|--ci=false)${E}" &&
  block "never update snapshots to make a test pass; find the cause first."
has "${S}git[[:space:]]+add${E}.*\.env(\.[A-Za-z0-9_-]+)?${E}" && ! has '\.env\.sample' &&
  block "only .env.sample may be committed."
has "${S}git[[:space:]]+add[[:space:]](.*[[:space:]])?(-f|--force)${E}" && block "git add --force bypasses .gitignore (env files, screenshots)."

if has "${S}git[[:space:]]+commit${E}" && [ -n "$cwd" ] && [ -d "$cwd" ]; then
  branch=$(git -C "$cwd" symbolic-ref --short HEAD 2>/dev/null || true)
  [ "$branch" = "main" ] && block "do not commit on main; create a branch first (one per ticket)."
fi

exit 0
