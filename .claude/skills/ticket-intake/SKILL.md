---
name: ticket-intake
description: Developer intake for a capstone story or feature ticket - run the zero-questions test, map the ticket to the code, and write every open question into the ticket (never ask in chat, never assume silently). Use when the user shares a client brief, a story, a ticket pack or a spec and asks whether it is ready to build, or asks to review a ticket before implementation.
---

# Ticket intake (developer side)

Capstone rule: developers ask questions **only through the tickets**. Do not write code in this skill.

## 1. Read

- The client brief, the story, its Given/When/Then criteria, the spec, and the QA test matrix if there is one.
- Capstone files live in `notes/capstone/` (brief, spec, stories `CAP-xxx-*.md`).

## 2. Map the ticket to the code

For each criterion, name where it would land, following the architecture in CLAUDE.md:

- DB: table/columns needed. A schema change needs `supabase/migrations/` and must be stated in the ticket (CLAUDE.md forbids it otherwise).
- `libs/` query, `services/` cached read (`cacheTag`), `actions/` mutation (`updateTag`), `ui/` page content, `components/`.
- Existing rules that apply: amounts are whole numbers (ML-003), the user id comes from the session, Prettier/lint/test hooks.

## 3. Zero-questions test

Ask: "Could I implement and test this from the ticket alone?" Check each item:

| Check | Typical gap |
|---|---|
| Actor and entry point | Which page or button starts it? Logged-in only? |
| Data | Fields, types, required/optional, limits, defaults, whole-number amounts |
| Rules | Validation messages, sorting, filtering, per user / per wallet |
| States | Empty, loading, error, success; what happens after submit |
| Edge cases | Zero, negative, very long text, duplicates, deleted wallet/category, dates and time zones |
| Permissions | Can a user see or change another user's data? |
| Out of scope | What is explicitly not built |
| Acceptance | Every criterion is Given/When/Then and testable (unit or Playwright) |

## 4. Write the questions into the ticket

Append to the ticket's `## Open questions` section (create it if missing):

```md
- [ ] Q<n> (dev, <date>): <question>. Options: A) ... B) ... Proposed: A, because ...
```

- One question per line, each with options and a proposed answer, so the client can answer quickly.
- Group questions by story. Number them so answers can be referenced (`Q3: A`).
- Count them: the number of questions is the planning-quality score for the ticket pack.

## 5. Report

Reply with: per story, the verdict **Ready** / **Not ready (n questions)**, the code areas it touches, and a rough size (S/M/L). Do not start implementing until the open questions that block it are answered in the ticket.
