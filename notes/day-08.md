# Day 08 — MCP and connectors (Developer track)

## 1. Setup

- [x] Playwright MCP server in `.mcp.json` (project scope, shared via MR). Pinned to `@playwright/mcp@0.0.84`, `--browser msedge` (Chrome is not installed), `--isolated` (no saved browser profile). Smoke-tested: 25 tools, `browser_navigate` works.
- [ ] Approve the server: in a new Code session Claude Code asks to trust the project's `.mcp.json` servers. Check with `/mcp` that `playwright` is **connected**.
- [ ] GitHub connector: claude.ai → Settings → Connectors → GitHub → Connect (OAuth as `linhlethi-agilityio`). Then in Desktop → Code the panel shows it under **Connectors**.

## 2. Exercise — one MCP tool end-to-end

### A. Playwright: close the last open item of ML-003

Prompt (in a new session, after `pnpm dev` is running in `moneylover/`):

> Use the playwright MCP tools. Open http://localhost:3000, sign in (I will type the password in the browser myself), go to Add Transaction, paste `1,234.56` into Amount and check the field shows `1,234`. Take a screenshot. Then tick the UI acceptance criterion in notes/tickets/ML-003-amount-input-drops-decimal-and-sign.md.

- Never paste real passwords into the chat; type them in the browser window.

### B. GitHub connector: query PRs and comment

> Using the GitHub connector, list the PRs in linhlethi-agilityio/claude-training with their state. Then add a comment on PR #1 summarising what was verified after merge.

- Check that Claude used the connector tools (not `gh` in Bash) in the activity log.

| | Result |
|---|---|
| MCP tool used | |
| Did it read real state instead of guessing? | |
| Permission prompts I saw | |
| What failed / needed steering | |

## 3. Course

- [ ] Introduction to model context protocol
