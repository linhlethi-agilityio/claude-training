# Day 05 — Memory, context, sessions (Developer track)

## 1. CLAUDE.md

- [x] Draft `CLAUDE.md` at the repo root: commands, architecture, conventions, "never do" (under one screen).
- [ ] Review it with the team; add or remove rules you disagree with.
- [ ] Check it loads: start a new Code session and ask "What are the test and build commands for this repo?" The answer should come from CLAUDE.md without reading other files.

## 2. Auto memory + compaction

1. In one session, do a long task (e.g. "explore `moneylover/src/actions` and explain every action", then follow-ups).
2. Tell Claude one preference during the session (e.g. "always run only the affected test file, not the full suite").
3. Run `/compact`.
4. Ask: "Which commands do we use, what did we change, and what is my test preference?"

| What | Survived compaction? |
|---|---|
| CLAUDE.md rules | |
| Files and changes from the session | |
| My stated preference | |
| Exact details (line numbers, error text) | |

- Then open a **new** session and ask about the preference again. Did auto memory save it? (`/memory` shows the files.)

## 3. Checkpointing / rewind

1. Ask Claude for a bad edit on purpose, e.g. "rename `formatCurrency` to `fmt` everywhere".
2. Look at the diff; run `pnpm test`.
3. Press `Esc` twice (or run `/rewind`) and restore the code to the checkpoint before that prompt.
4. Confirm with `git status` that the tree is clean.

- Notes: rewind restores Claude's file edits; it does **not** undo shell commands such as `git commit` or `rm`.

## 4. Exercise — prove context matters

Same task, two sessions. Suggested task: **"`formatAmount` in `src/utils/number.ts` duplicates the thousands-separator regex from `formatCurrency` in `src/utils/input.ts`. Remove the duplication without changing behaviour."**

Run each session on its own throwaway branch, then compare the diffs.

| | Session A: fresh, no exploring | Session B: first "read `src/utils`, its tests and ticket ML-003" |
|---|---|---|
| Followed repo conventions (barrel exports, import comments, `__test__/`)? | | |
| Kept ML-003 behaviour (whole numbers, `1.000` as thousands)? | | |
| Test passes on first run? | | |
| Number of corrections I had to make | | |
| Tokens / context used (`/context`) | | |

Conclusion (2–3 sentences):

## 5. Habits

- One topic per session; `claude --resume` (or the sidebar) to continue an old topic.
- Put a rule in CLAUDE.md when the whole team needs it; let auto memory hold personal preferences.
