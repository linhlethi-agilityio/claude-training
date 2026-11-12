#!/usr/bin/env bash
# PostToolUse hook (Edit|Write|MultiEdit): run Prettier on the file Claude just changed,
# using the app's own Prettier and .prettierrc. Files outside moneylover/ are left alone.
set -euo pipefail

file=$(jq -r '.tool_input.file_path // empty')
app="${CLAUDE_PROJECT_DIR:-$PWD}/moneylover"
prettier="$app/node_modules/.bin/prettier"

case "$file" in "$app"/*) ;; *) exit 0 ;; esac
case "$file" in *.ts | *.tsx | *.js | *.jsx | *.mjs | *.cjs | *.json | *.css) ;; *) exit 0 ;; esac
[ -f "$file" ] || exit 0
[ -x "$prettier" ] || exit 0 # e.g. a fresh worktree before pnpm install

cd "$app"
"$prettier" --write --log-level warn "$file" >/dev/null || {
  echo "Prettier could not format $file (syntax error?)" >&2
  exit 1
}
