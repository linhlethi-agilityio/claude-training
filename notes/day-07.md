# Day 07 — Skills, commands, plugins (Developer track)

## 1. Team skill + personal command

- [x] Team skill: `.claude/skills/fix-ticket/SKILL.md` (ticket → plan → branch → failing test → fix → verify → ticket update → MR)
- [x] Personal command: `.claude/commands/sync-remotes.md` (`/sync-remotes`: fast-forward `main` from GitLab, push it to GitHub, never force-push)
- [ ] Shipped via MR to `.claude/`
- [ ] Tried in a new Code session:
  - "Fix ML-004" → does Claude pick up the `fix-ticket` skill on its own? (It should appear in the activity log.)
  - `/sync-remotes` after the MR is merged → does it stop on a dirty tree / diverged GitHub?

| Check | Result |
|---|---|
| Skill triggered without naming it | |
| Steps followed (failing test first, ticket updated) | |
| `/sync-remotes` asked for permission only for unlisted commands | |
| What I would change in the skill/command | |

## 2. Plugin

- Browse: `/plugin` → marketplace. Install one plugin (e.g. a TypeScript LSP / code-intelligence plugin).
- Evaluate honestly on this repo (e.g. "find all callers of `formatAmount`", "rename a prop"):

| Question | Answer |
|---|---|
| Plugin name + what it bundles (skills / hooks / commands / LSP) | |
| Task I tried | |
| Better than without it? (speed, accuracy, tokens) | |
| Any downside (noise, permissions, setup) | |
| Keep or uninstall? Why? | |

## 3. Course

- [ ] Introduction to agent skills
