# Day 09 — Hooks and automation (Developer track)

## 1. Hooks (shipped via MR)

Project hooks live in `.claude/settings.json`, scripts in `.claude/hooks/`.

| Hook | Event | What it does |
|---|---|---|
| `block-forbidden.sh` | `PreToolUse` (Bash) | Blocks (exit 2) what CLAUDE.md "Never do" forbids: `--no-verify`, force-push, `git push origin main`, `jest -u` / `--updateSnapshot`, `git add` of `.env*` (except `.env.sample`), `git add -f`, `git commit` on `main`. |
| `format-on-edit.sh` | `PostToolUse` (Edit/Write/MultiEdit) | Runs the app's Prettier (`moneylover/.prettierrc`) on the edited `ts/tsx/js/json/css` file under `moneylover/`. Skips silently if `node_modules` is missing (fresh worktree). |
| notify-on-finish | `Stop`, `Notification` | macOS notification via `osascript`. Personal, so it is in `.claude/settings.local.json` (gitignored), not in the MR. |

- [x] Scripts tested with sample JSON input (blocked and allowed commands, unformatted and broken files).
- [ ] In a new session, ask Claude to `git commit --no-verify` → blocked, and Claude explains why.
- [ ] Ask Claude to edit a file with bad formatting → the file is formatted after the edit.
- [ ] Check `/hooks` lists all hooks.

## 2. Automation ladder

| Step | What I did | Result |
|---|---|---|
| `/goal` on a bounded task (e.g. "all `number.test.ts` cases pass for ML-004") | | |
| Desktop scheduled task (morning briefing: open MRs, failing tests, open tickets) | | |
| Routines (cloud, cron) — overview only | | |
| GitHub Actions `@claude` on `linhlethi-agilityio/claude-training` | | |

## 3. Exercise — `@claude` review on the next PR

- Setup: `/install-github-app` (Claude GitHub App + `.github/workflows/claude.yml` + secret).
- Open the next PR on GitHub (e.g. ML-004), comment `@claude review`.

| Comment from @claude | Correct? | Useful? | Action taken |
|---|---|---|---|
| | | | |

Overall: signal vs noise, anything it missed that a human reviewer caught.
